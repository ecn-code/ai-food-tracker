import { AIGateState, AIMessageType, BranchDef, StateDef } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class AIGate extends State {

    private branches: Map<string, BranchDef>;
    private prompt: string;

    constructor(stateDef: StateDef, context: Context) {
        super(stateDef, context);

        const aiGateDef = stateDef as AIGateState;
        this.prompt = aiGateDef.prompt;
        this.branches = new Map<string, BranchDef>(Object.entries(aiGateDef.branches));
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running Gate");

        const generatedMessage = await this.context.aiService.generate(`
            Message:
            |${this.context.getUserMessage()}|

            Task: ${this.prompt}

            Options:
                [${Array.from(this.branches.entries()).map(entry => `${entry[0]} -> ${entry[1].checkDescription}\n`)}]

            Respond with a JSON object and nothing else:
                { "option": "<option chosen>" }
        `);
        Log.debug("Gate generated message", generatedMessage.response);

        try {
            const optionChosen = JSON.parse(generatedMessage.response);
            Log.debug("Gate option chosen: ", optionChosen.option);

            if (!optionChosen.option || !this.branches.has(optionChosen.option)) {
                throw new Error("Option not supported");
            }

            const branch = this.branches.get(optionChosen.option);
            if (!branch || !branch.nextStateName) {
                throw new Error("Option not supported");
            }

            return this.context.transitionToByName(branch.nextStateName);

        } catch (e) {
            Log.error("Gate error parsing ", e as Error);
            throw new Error("Error parsing");
        }
    }

    name(): string {
        return "Gate";
    }

}
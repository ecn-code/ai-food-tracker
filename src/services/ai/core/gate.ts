import { AIMessageType, GateBranch } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class Gate implements State {

    private context: Context;
    private branches: Map<string, GateBranch>;

    constructor(context: Context, branches: Map<string, GateBranch>) {
        this.context = context;
        this.branches = branches;
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running Gate");

        const generatedMessage = await this.context.aiService.generate(`
            Message:
            |${this.context.getUserMessage()}|

            Evaluate the message: which of these options fits?:
                [${Array.from(this.branches.entries()).map(entry => `${entry[0]} -> ${entry[1].description}\n`)}]

            Respond with a JSON object and nothing else:
                { "option": "<option chosen>" }
        `);
        Log.debug("Gate generated message", generatedMessage.response);

        try {
            const optionChosen = JSON.parse(generatedMessage.response);
            Log.debug("Gate option chosen: ", optionChosen.option);

            if(!optionChosen.option || !this.branches.has(optionChosen.option)) {
                throw new Error("Option not supported");
            }

            const branch = this.branches.get(optionChosen.option);
            if(!branch || !branch.state) {
                throw new Error("Option not supported");
            }

            return this.context.transitionTo(branch.state);

        } catch(e) {
            Log.error("Gate error parsing ", e as Error);
            throw new Error("Error parsing");
        }
    }

    name(): string {
        return "Gate";
    }

}
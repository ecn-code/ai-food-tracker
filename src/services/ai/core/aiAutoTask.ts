import { AIAutoTaskState, AIMessageType, RoleEnum, StateDef } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class AIAutoTask extends State {

    private prompt: string;
    private nextStateName: string | null;

    constructor(stateDef: StateDef, context: Context) {
        super(stateDef, context);

        const aiAutoTaskDef = stateDef as AIAutoTaskState;
        this.prompt = aiAutoTaskDef.prompt;
        this.context = context;
        this.nextStateName = aiAutoTaskDef.nextStateName;
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running AutoTask");

        const generatedMessage = await this.context.aiService.generate(`
            Message:
            |${this.context.getUserMessage()}|

            ${this.prompt}
        `);
        Log.debug("AutoTask generated message", generatedMessage.response);

        if (this.nextStateName) {
            return this.context.transitionToByName(this.nextStateName);
        }

        return Promise.resolve({ role: RoleEnum.ASSISTANT, content: generatedMessage.response });
    }

}
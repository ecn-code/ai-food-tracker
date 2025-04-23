import { AIMessageType, RoleEnum } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class AIAutoTask implements State {

    private context: Context;
    private prompt: string;
    private nextStateName: string | null;

    constructor(prompt: string, context: Context, nextStateName: string | null) {
        this.prompt = prompt;
        this.context = context;
        this.nextStateName = nextStateName;
    }
    
    name(): string {
        return "AutoTask";
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
import { AIMessageType, RoleEnum } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class AutoTask implements State {

    private context: Context;
    private prompt: string;
    private nextState: State | null;

    constructor(prompt: string, context: Context, nextState: State | null = null) {
        this.prompt = prompt;
        this.context = context;
        this.nextState = nextState;
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

        if (this.nextState) {
            return this.context.transitionTo(this.nextState);
        }

        return Promise.resolve({ role: RoleEnum.ASSISTANT, content: generatedMessage.response });
    }

}
import { AIMessageType, RoleEnum } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class UserInput implements State {

    private context: Context;
    private text: string;
    private isExecuted: boolean;
    private nextStateName: string;

    constructor(text: string, context: Context, nextStateName: string) {
        this.context = context;
        this.nextStateName = nextStateName;
        this.isExecuted = false;
        this.text = text;
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running UserInput");

        if (this.isExecuted) {
            Log.debug("->UserInput changing state");
            return this.context.transitionToByName(this.nextStateName);
        }

        Log.debug("->UserInput sending message");
        this.isExecuted = true;
        return Promise.resolve({ role: RoleEnum.ASSISTANT, content: this.text });
    }

    name(): string {
        return "UserInput";
    }

}
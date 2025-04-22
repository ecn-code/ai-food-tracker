import { AIMessageType, RoleEnum } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class UserInput implements State {

    private context: Context;
    private text: string;
    private isExecuted: boolean;
    private nextState: State;
    
    constructor(text: string, context: Context, nextState: State) {
        this.context = context;
        this.nextState = nextState;
        this.isExecuted = false;
        this.text = text;
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running UserInput");

        if(this.isExecuted) {
            Log.debug("->UserInput changing state");
            return this.context.transitionTo(this.nextState);
        }

        Log.debug("->UserInput sending message");
        this.isExecuted = true;
        return Promise.resolve({role: RoleEnum.ASSISTANT, content: this.text});
    }

    name(): string {
        return "UserInput";
    }
    
}
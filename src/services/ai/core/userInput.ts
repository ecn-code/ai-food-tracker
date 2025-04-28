import { AIMessageType, RoleEnum, StateDef, UserInputState } from "../../../types";
import { Context } from "../workflow/context";
import { Log } from "./log";
import { State } from "./state";

export class UserInput extends State {

    private text: string;
    private isExecuted: boolean;
    private nextStateName: string;

    constructor(stateDef: StateDef, context: Context) {
        super(stateDef, context);

        const userInputState = stateDef as UserInputState;
        if(!userInputState.nextStateName) {
            throw new Error("UserInput nextState cannot be null");
        }
        
        this.nextStateName = userInputState.nextStateName;
        this.isExecuted = false;
        this.text = userInputState.feedback;
    }

    async run(): Promise<AIMessageType> {
        Log.debug("Running UserInput");

        if (this.isExecuted) {
            Log.debug("->UserInput changing state", this.context.getUserMessage());
            this.isExecuted = false;
            return this.context.transitionToByName(this.nextStateName);
        }

        Log.debug("->UserInput sending message");
        this.isExecuted = true;
        const message = { role: RoleEnum.ASSISTANT, content: this.text };
        this.context.addChat(message);
        
        return Promise.resolve(message);
    }

}
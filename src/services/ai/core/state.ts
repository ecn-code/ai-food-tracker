import { AIMessageType, StateDef } from "../../../types";
import { Context } from "../workflow/context";

export abstract class State {
    
    protected context: Context;

    constructor(stateDef: StateDef, context: Context) {
        this.context = context;
    }

    abstract run(): Promise<AIMessageType>;
}
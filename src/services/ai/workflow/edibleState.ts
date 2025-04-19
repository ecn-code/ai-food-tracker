import { AIResponseType, ConstructorState, RoleEnum } from "../../../types";
import { Context } from "./context";
import { State } from "./state";

export class EdibleState implements State {
    private context: Context;
    private successState: ConstructorState;
    private failState: ConstructorState | null;

    constructor(context: Context, successState: ConstructorState, failState: ConstructorState | null) {
        this.context = context;
        this.successState = successState;
        this.failState = failState;
    }

    public async run(): Promise<AIResponseType> {
        console.debug('Running EdibleState');

        const generated = await this.context.aiService.generate(`
            Analiza el siguiente mensaje: 
            |${this.context.getLastMessage().content}|
            
            Dado el mensaje a analizar, decidir si es o no comestible:
                {"isEdible": true | false, "why": "<why is or not a basic ingredient>"}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        console.debug('->EdibleState', generated.response);
        const response = JSON.parse(generated.response);
        if (response.isEdible) {
            console.debug("->EdibleState ", response);
            return this.context.transitionTo(this.successState(this.context));
        } else {
            //TODO: Improve answer
            return Promise.resolve({ message: { role: RoleEnum.ASSISTANTE, content: "Escribe un producto o ingrediente." } });
        }
    }
}
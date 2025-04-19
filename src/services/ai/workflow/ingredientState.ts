import { AIResponseType, ConstructorState } from "../../../types";
import { Context } from "./context";
import { State } from "./state";

export class IngredientState implements State {
    private context: Context;
    private successState: ConstructorState;
    private failState: ConstructorState;

    constructor(context: Context, successState: ConstructorState, failState: ConstructorState) {
        this.context = context;
        this.successState = successState;
        this.failState = failState;
    }

    public async run(): Promise<AIResponseType> {
        console.debug('Running IngredientState');

        const generated = await this.context.aiService.generate(`
            Analiza el siguiente mensaje:
            |${this.context.getLastMessage().content}|

            Dado el mensaje a analizar, decidir si se trata de un alimento que puede utilizarse como un ingrediente en la cocina (aunque esté compuesto de varios ingredientes) y no de un plato completo o receta.

            Ejemplo:
            [
                'chocolate con leche' => true,  
                'tarta de manzana' => false  
            ]

            Responde solo en formato JSON: {"isIngredient": true | false, "why": "<explicación>"}
        `);

        console.debug('->IngredientState', generated.response);
        const response = JSON.parse(generated.response);
        if (response.isIngredient) {
            console.debug("->IngredientState : ", response);
            return this.context.transitionTo(this.successState(this.context));
        } else {
            return this.context.transitionTo(this.failState(this.context));
        }
    }
}
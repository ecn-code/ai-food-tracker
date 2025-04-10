import { Context } from "./context";
import RetrieveNutritionalValues from "./retrieve-nutritional-values";
import { State } from "./state";

export default class RetrieveFoodInformation implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        const response = await this.context.aiService.chat(this.context.track.messages);
        const evaluation = await this.context.aiService.generate(`
            Analiza los dos últimos mensajes: 
            |${this.context.track.messages[this.context.track.messages.length - 1].content}|
            |${response.message.content}|
            
            La conversación termina cuando el usuario exprese que ese día no ha comido nada más.
            Nunca despues de haber hablado de un plato o un ingrediente, tiene que dar por finalizada la conversación de forma directa.
                {"isFinished": true | false, "motivo": "<Por que>"}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);
        const evaluationResult = JSON.parse(evaluation.response);
        console.log(evaluationResult);
        if(evaluationResult.isFinished) {
            return this.context.transitionTo(new RetrieveNutritionalValues(this.context));
        } else {
            return Promise.resolve(response);
        }
    }
}
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
            |${response.message.content}|
            
            En este mensaje esta el usuario esta dando por finalizada la conversación.
            Habla de un plato, un ingrediente o alguna duda, no es finalizar.
            Debe ser más especifico diciendo que ya esta todo, o que ya no tiene nada más que añadir.
            O bien cualquier frase que de a entender de forma directa o indirecta que finaliza, acaba o termina:
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
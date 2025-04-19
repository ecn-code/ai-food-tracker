import { Context } from "../context";
import { State } from "../state";
import AskIngredients from "./ask-ingredients";
import CreateStructuredData from "./create-structured-data";

export default class CheckEnd implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running CheckEnd');

        const lastMessage = this.context.getLastMessage();
        const evaluation = await this.context.aiService.generate(`
            Mensaje: 
            |${lastMessage.content}|
            
            Evalua el mensaje y decide entre estas dos opciones:
                Es un mensaje que da a entender que en el desayuno no ha comido nada más. Ejemplos: ['no']
                {"isEnd": true | false, "why": "<Describe why is or no end message>"}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        const evaluationResult = JSON.parse(evaluation.response);
        console.log(evaluationResult);
        if(evaluationResult.isEnd) {
            return this.context.transitionTo(new CreateStructuredData(this.context));
        }
        
        //TODO: Explicar porque la respuesta anterior no era correcta
        return this.context.transitionTo(new AskIngredients(this.context));
    }
}
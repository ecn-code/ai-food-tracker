import { Context } from "../context";
import { State } from "../state";
import AskMoreFoodInformation from "./ask-more-food-information";
import CreateStructuredData from "./create-structured-data";

export default class CheckNoFoodAnswer implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running CheckNoFoodAnswer');

        //1-Evaluar el último mensaje
        //1a- La comida no es del desayuno, o no es comida
        //1b- No ha comido nada más en el desayuno
        const lastMessage = this.context.track.getLastConversationMessage();
        this.context.temporalChat.push(lastMessage);
        const evaluation = await this.context.aiService.generate(`
            Mensaje: 
            |${lastMessage.content}|
            
            Evalua el mensaje y decide entre estas dos opciones:
                OUT_CONTEXT: Es un mensaje que no es de comida, no es de comida del desayuno o es cualquier otra cosa
                END: Es un mensaje que da a entender que en el desayuno no ha comido nada más Ejemplos: ['no']
                {"isEnd": true | false, "why": "<Describe why is or no end message>"}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        const evaluationResult = JSON.parse(evaluation.response);
        console.log(evaluationResult);
        if(evaluationResult.isEnd) {
            return this.context.transitionTo(new CreateStructuredData(this.context));
        }
        
        //TODO: Explicar porque la respuesta anterior no era correcta
        return this.context.transitionTo(new AskMoreFoodInformation(this.context));
    }
}
import { Context } from "../context";
import { State } from "../state";
import AskMoreFoodInformation from "./ask-ingredients";
import CheckNoFoodAnswer from "./checkEnd";

export default class CheckFoodAnswer implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run() {
        console.debug('Running CheckFoodAnswer');

        //1-Evaluar el último mensaje
        //1a- Si es comida y no dice nada de que no haya sido en el desayuno, lanzar estado para preguntar si ha comido algo más en el desayuno
        //1b- No es comida o no es del desayuno, lanzar estado que elimina el último mensaje y pregunta al usuario que ha desayunado
        const lastMessage = this.context.track.getLastConversationMessage();
        this.context.temporalChat.push(lastMessage);
        const evaluation = await this.context.aiService.generate(`
            Mensaje: 
            |${lastMessage.content}|
            
            Evalua si el mensaje es sobre algo comestible
                {"isEdible": true | false, "why": "<Describe why is or no edible>"}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        const evaluationResult = JSON.parse(evaluation.response);
        console.log(evaluationResult);
        if(evaluationResult.isEdible) {
            return this.context.transitionTo(new AskMoreFoodInformation(this.context));
        }
            
        return this.context.transitionTo(new CheckNoFoodAnswer(this.context));
    }
}
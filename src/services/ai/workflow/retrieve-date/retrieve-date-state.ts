import { AIResponseType, RoleEnum } from "../../../../types";
import { Context } from "../context";
import AskFoodInformation from "../retrieve-ingredients/ask-food-information";
import { State } from "../state";

export class RetrieveDateState implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run(): Promise<AIResponseType> {
        console.debug('Running RetrieveDateState');

        const generated = await this.context.aiService.generate(`
            Analiza el siguiente mensaje: 
            |${this.context.track.getLastMessage()}|
            
            Busca una fecha, la fecha tiene que tener dia, mes y año, si falta alguno responde null, la respuesta debe ser un JSON de la siguiente forma:
                {"date": "yyyy-mm-dd" | null}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        console.debug('RetrieveDateState', generated.response);
        const response = JSON.parse(generated.response);
        if (response.date) {
            this.context.track.date = response.date;
            console.debug("RetrieveDateState date: ", response.date);
            return this.context.transitionTo(new AskFoodInformation(this.context));
        } else {
            //TODO: Hacer que la IA con los mensajes anteriores de una respuesta personalizada
            return Promise.resolve({ message: { role: RoleEnum.ASSISTANTE, content: "Necesitamos saber el día para el cual vamos a guardar esta información." } });
        }
    }
}
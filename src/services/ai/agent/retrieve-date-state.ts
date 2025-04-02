import { AIResponseType, RoleEnum } from "../../../types";
import { Context } from "./context";
import RetrieveFoodInformation from "./retrieve-food-information";
import { State } from "./state";

export class RetrieveDateState implements State {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public async run(): Promise<AIResponseType> {
        if(this.context.track.date != null) {
            return this.context.transitionTo(new RetrieveFoodInformation(this.context));
        } else {
            const generated = await this.context.aiService.generate(`
                Analiza el siguiente mensaje: 
                |${this.context.track.getLastMessage()}|
                
                Busca una fecha, la fecha tiene que tener dia, mes y año, si falta alguno responde null, la respuesta debe ser un JSON de la siguiente forma:
                    {"date": "yyyy-mm-dd" | null}
    
                Solo responde con JSON no añadas ningún texto ni formato extra.
            `);
    
            console.debug(generated.response);
            const response = JSON.parse(generated.response);
            if (response.date) {
                this.context.track.date = response.date;
                console.debug("OllamaService date: ", response.date);
                return this.context.aiService.chat(this.context.track.messages);
            } else {
                return Promise.resolve({ message: { role: RoleEnum.ASSISTANTE, content: "Necesitamos saber el día para el cual vamos a guardar esta información." } });
            }
        }
    }
}
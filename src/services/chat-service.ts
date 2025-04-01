import { AIMessageType, RoleEnum, TrackType } from "../types";
import { OllamaService } from "./ai/ollama-service";

export default async function chat({ track, messages }: { track: TrackType, messages: Array<AIMessageType> }): Promise<{ message: AIMessageType }> {
    if (!track.date) {
        const generated = await OllamaService.getInstance().generate(`
            Analiza el siguiente mensaje: 
            |${messages[messages.length - 1].content}|
            
            Busca una fecha, la fecha tiene que tener dia, mes y año, si falta alguno responde null, la respuesta debe ser un JSON de la siguiente forma:
                {"date": "yyyy-mm-dd" | null}

            Solo responde con JSON no añadas ningún texto ni formato extra.
        `);

        console.debug(generated.response);
        const response = JSON.parse(generated.response);
        if (response.date) {
            track.date = response.date;
            console.debug("OllamaService date: ", response.date);
            return OllamaService.getInstance().chat(messages);
        } else {
            return Promise.resolve({ message: { role: RoleEnum.ASSISTANTE, content: "Necesitamos saber el día para el cual vamos a guardar esta información." } });
        }
    }


    return OllamaService.getInstance().chat(messages);
};
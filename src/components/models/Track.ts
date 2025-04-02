import { AIMessageType, RoleEnum } from "../../types";

export default class Track {
    id: string;
    messages: Array<AIMessageType>;
    date: Date | null;
    name: string;

    constructor() {
        this.id = Math.random().toString(36);
        this.name = 'Pending';
        this.date = null;
        this.messages = [{
            role: RoleEnum.SYSTEM,
            content: `
                El usuario te dira un dia de la semana.
                Desde este momento conversareis sobre que ha comido.
                Si escribe mal, corrigelo, pero no se lo comentes, simplemente ten en cuenta la forma correcta.

                Si habla de un plato investiga los ingredientes usados haciendo sugerencias.
                Si habla de ingredientes intenta averiguar si forman parte de un plato.

                Responde en español.
            `
        }];
    }

    getLastMessage() {
        return this.messages[this.messages.length - 1].content;
    }
}
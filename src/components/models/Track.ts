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
                Tu objetivo es saber todo lo que ha comido en ese día.
                No hables de recetas, limitate a saber que ha comido esa persona a lo largo de ese día.
                Para ello tendras que empezar preguntando. ¿Que comiste el día dd/MM/YYYY?
                Luego la persona te hablara de algún plato o producto.
                Si se trata de un plato averigua de que ingredientes se compone, no presupongas.

                Responde en español.
            `
        }];
    }

    getLastMessage() {
        return this.messages[this.messages.length - 1].content;
    }
}
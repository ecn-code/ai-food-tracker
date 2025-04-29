import { AIMessageType } from "../../types";

export default class Track {
    id: string;
    conversation: Array<AIMessageType>;
    messages: Array<AIMessageType>;
    date: Date | null;
    name: string;
    selected: boolean;

    constructor() {
        this.id = Math.random().toString(36);
        this.name = 'Pending';
        this.date = null;
        this.conversation = [];
        this.messages = [];
        this.selected = false;
    }
}
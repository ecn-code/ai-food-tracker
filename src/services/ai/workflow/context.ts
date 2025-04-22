import { AIMessageType, GateBranch } from "../../../types";
import { AIService } from "../ai-service";
import { AutoTask } from "../core/autoTask";
import { Gate } from "../core/gate";
import { Log } from "../core/log";
import { State } from "../core/state";
import { UserInput } from "../core/userInput";

export class Context {
    aiService: AIService;
    private state: State;
    private chat: Array<AIMessageType>;
    private userMessage: string;

    constructor(aiService: AIService) {
        Log.debug('Context created')

        this.aiService = aiService;
        this.chat = [];
        this.userMessage = '';

        const branches = new Map<string, GateBranch>();
        branches.set("DATE_COMPLETE", {description: "Only if the date includes **explicitly** the **day**, **month**, and **year**. Do not assume any missing parts.", state: new AutoTask("Devolver la fecha en formato dd-mm-yyyy", this)});
        branches.set("NON_DATE", {description: "Use this if the message does **not** contain a full, explicit date.", state: new AutoTask("¿Por que no es una fecha completa?", this)});

        this.state = new UserInput("Introduce una fecha.", this, 
            new Gate(this, branches)
        )
    }

    run(): Promise<AIMessageType> {
        Log.debug('Context running state', this.state.name())
        return this.state.run();
    }

    transitionTo(state: State) {
        this.state = state;
        return this.run();
    }

    setUserMessage(message: string) {
        this.userMessage = message;
    }

    getUserMessage() {
        return this.userMessage;
    }

    addChat(chat: AIMessageType) {
        this.chat.push(chat);
    }
}
import { AIMessageType } from "../../../types";
import { AIService } from "../ai-service";
import { Log } from "../core/log";
import { State } from "../core/state";
export class Context {
    aiService: AIService;
    private state: State | null;
    private chat: Array<AIMessageType>;
    private userMessage: string;

    constructor(aiService: AIService) {
        Log.debug('Context created')

        this.aiService = aiService;
        this.chat = [];
        this.userMessage = '';

        this.state = null;
    }

    run(): Promise<AIMessageType> {
        if(!this.state) {
            throw new Error("State is not defined");
        }

        Log.debug('Context running state', this.state.name())
        return this.state.run();
    }

    transitionTo(state: State) {
        this.state = state;
        return this.run();
    }

    transitionToByName(stateName: string) {
        return this.transitionTo();
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
import { AIMessageType } from "../../../types";
import { AIService } from "../ai-service";
import { Log } from "../core/log";
import { State } from "../core/state";
export class Context {
    aiService: AIService;
    private state: State | null;
    private states: Map<string, State>;
    private chat: Array<AIMessageType>;
    private userMessage: string;

    constructor(aiService: AIService, initialStateName: string | null, createStates: (context: Context) => Map<string, State>) {
        Log.debug('Context created')

        this.aiService = aiService;
        this.chat = [];
        this.userMessage = '';

        this.states = createStates(this);

        this.state = null;
        if(initialStateName) {
            this.state = this.getState(initialStateName);
        }
    }

    run(): Promise<AIMessageType> {
        if(!this.state) {
            throw new Error("There is no state to run");
        }

        Log.debug('Context running state', this.state.constructor.name)
        return this.state.run();
    }

    transitionTo(state: State) {
        this.state = state;
        return this.run();
    }

    transitionToByName(stateName: string) {
        return this.transitionTo(this.getState(stateName));
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

    private getState(stateName: string): State {
        const state = this.states.get(stateName);
        if(state) {
            return state;
        }
        
        throw new Error(`There is no State named ${stateName}`);
    }
}
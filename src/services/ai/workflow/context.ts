import { AIMessageType } from "../../../types";
import { AIService } from "../ai-service";
import { EdibleState } from "./edibleState";
import { IngredientState } from "./ingredientState";
import AskIngredients from "./retrieve-ingredients/ask-ingredients";
import CreateStructuredData from "./retrieve-ingredients/create-structured-data";
import { State } from "./state";

export class Context {
    aiService: AIService;
    food: Array<object>;
    private state: State;
    private messages: Array<AIMessageType>;

    constructor(aiService: AIService) {
        this.aiService = aiService;
        this.state = new EdibleState(this, 
            (context: Context) => new IngredientState(
                context, 
                (context) => new CreateStructuredData(context),
                (context) => new AskIngredients(context)
            ), 
            null
        );
        this.food = [];
        this.messages = [];
    }

    run() {
        return this.state.run();
    }

    transitionTo(state: State) {
        this.state = state;
        return this.run();
    }

    pushMessage(message: AIMessageType) {
        this.messages.push(message);
    }

    getLastMessage(): AIMessageType {
        return this.messages[this.messages.length - 1];
    }

    getMessages(): Array<AIMessageType> {
        return [...this.messages];
    }
}
import { AIMessageType } from "../../types";

export interface AIService {
    chat(messages: Array<AIMessageType>): Promise<{message: AIMessageType}>;
}
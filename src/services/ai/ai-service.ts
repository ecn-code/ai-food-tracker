import { AIMessageType, AIResponseType } from "../../types";

export interface AIService {
    chat(messages: Array<AIMessageType>): Promise<AIResponseType>;
    generate(prompt: string): Promise<{response: string}>;
}
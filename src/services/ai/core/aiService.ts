import { AIMessageType } from "../../../types";

export interface AIService {
    chat(messages: Array<AIMessageType>): Promise<AIMessageType>;
    generate(prompt: string): Promise<{response: string}>;
}
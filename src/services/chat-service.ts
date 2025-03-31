import { AIMessageType } from "../types";
import { OllamaService } from "./ai/ollama-service";

export default function chat({messages}: {messages: Array<AIMessageType>}) : Promise<{message: AIMessageType}> {
    return OllamaService.getInstance().chat(messages);
};
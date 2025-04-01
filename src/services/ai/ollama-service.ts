import { AIMessageType } from "../../types";
import type { AIService } from "./ai-service";

export class OllamaService implements AIService {

    private static instance: OllamaService;

    MODEL:string = "qwen2.5:7b";
    OLLAMA_API:string = "http://localhost:11434";

    static getInstance(): OllamaService {
        if (!OllamaService.instance) {
            OllamaService.instance = new OllamaService();
        }
        return OllamaService.instance;
    }

    async chat(messages: Array<AIMessageType>): Promise<{message: AIMessageType}> {
        console.debug("OllamaService.chat", messages);
        const response = await fetch(`${this.OLLAMA_API}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.MODEL,
                messages,
                stream: false,
            }),
        });
        console.debug("Response from chat", response);
    
        return await response.json();
    }

    async generate(prompt: string): Promise<{response: string}> {
        console.debug("OllamaService.generate", prompt);
        const response = await fetch(`${this.OLLAMA_API}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.MODEL,
                prompt,
                stream: false,
            }),
        });
        console.debug("Response from generate", response);
    
        return await response.json();
    }
}
import { KeyboardEvent, useState, useRef, useEffect } from "react";
import { AIMessageType, RoleEnum } from "../types";
import { Context } from "../services/ai/workflow/context";
import { OllamaService } from "../services/ai/ollama-service";
import Track from "./models/Track";

export default function TrackPanel({ track }: { track: Track }) {
  const contextRef = useRef<Context | null>(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<AIMessageType[]>([]);
  const [disabled, setDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasRunRef = useRef("-1");

  // Ejecutar solo una vez al montar
  useEffect(() => {
    if (hasRunRef.current === track.id.toString()) return;

    console.log('useEffect');
    hasRunRef.current = track.id.toString();  // Aseguramos que el ID de track sea el mismo
    contextRef.current = new Context(new OllamaService());
    setMessages(track.conversation);

    return () => {
      setMessages([]);
      setDisabled(false);
      setText('');
      hasRunRef.current = "-1";
      contextRef.current = null;
    };

  }, [track.id]); // Dependemos solo de track.id para reinicializar el contexto

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEnterPress = async (event: KeyboardEvent) => {
    if (event.key !== "Enter" || disabled) return;

    event.preventDefault();
    const userMessage: AIMessageType = { role: RoleEnum.USER, content: text };

    setMessages(prev => [...prev, userMessage]);
    contextRef.current?.setUserMessage(text);
    setText('');
    setDisabled(true);

    console.log('Running state');
    const response = await contextRef.current!.run();
    console.log(response)
    setMessages(prev => [...prev, response]);
    setDisabled(false);
  };

  return (
    <section className="flex flex-col items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4">
      {messages.length > 0 ? (
        <div className="flex flex-1 flex-col overflow-y-auto max-h-[calc(68vh)] w-full">
          <div className="flex flex-col gap-2 flex-1">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`p-2 rounded max-w-[75%] ${message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
              >
                {message.content}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <h2 className="text-xl font-bold mb-4 text-center">
          Describe la comida de un día y yo te ayudaré a analizar los valores nutricionales.
        </h2>
      )}

      <textarea
        className="w-full bg-gray-100 p-2 border border-gray-300 rounded resize-none mt-2"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleEnterPress}
        disabled={disabled}
      />
    </section>
  );
}

import { KeyboardEvent, useState, useRef, useEffect } from "react";
import { RoleEnum } from "../types";
import { Context } from "../services/ai/agent/context";
import { OllamaService } from "../services/ai/ollama-service";
import Track from "./models/Track";

export default function TrackPanel({ track }: { track: Track }) {
  const context = new Context(new OllamaService(), track);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(track.messages);
  const [disabled, setDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const handleEnterPress = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const updatedMessages = [...messages, { role: RoleEnum.USER, content: text }];
      setText('')
      setMessages(
        updatedMessages
      );
      context.track.messages = updatedMessages;
      const response = await context.run();
      setMessages(messages =>
        [...messages, response.message]
      );
    }
  };

  useEffect(() => {
    setMessages(track.messages)
    setDisabled(false)
  }, [track]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex flex-col items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4">
      <div className={`flex flex-1 flex-col overflow-y-auto ${messages.length == 0 ? 'max-h-[calc(34vh)]' : 'max-h-[calc(68vh)]'} w-full`}>
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

      {messages.length === 0 && (
        <h2 className="text-xl font-bold mb-4 text-center">
          Describe la comida de un día y yo te ayudaré a analizar los valores nutricionales.
        </h2>
      )}

      <textarea
        disabled={disabled}
        className="w-full bg-gray-100 p-2 border border-gray-300 rounded resize-none mt-2"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleEnterPress}
      />
    </section>

  );
}

import { KeyboardEvent, useState, useRef, useEffect } from "react";
import { RoleEnum } from "../types";
import { Context } from "../services/ai/workflow/context";
import { OllamaService } from "../services/ai/ollama-service";
import Track from "./models/Track";

export default function TrackPanel({ track }: { track: Track }) {
  const contextRef = useRef(new Context(new OllamaService()));
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(track.conversation);
  const [disabled, setDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleEnterPress = async (event: KeyboardEvent) => {
    if (disabled) {
      if (event.key === "Enter") event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const userMessage = { role: RoleEnum.USER, content: text };
      const updatedMessages = [...messages, userMessage];
      setText('');
      setMessages(updatedMessages);
      contextRef.current.pushMessage(userMessage);
      track.conversation = updatedMessages;
      setDisabled(true);
      const response = await contextRef.current.run();
      setDisabled(false);
      setMessages(messages => [...messages, response.message]);
    }
  };

  useEffect(() => {
    setMessages(track.conversation);
    setDisabled(false);
    setText('');
    contextRef.current = new Context(new OllamaService());

    return () => {
      track.selected = false;
    };
  }, [track]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex flex-col items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4">
      {messages.length > 0 && (
        <div className={`flex flex-1 flex-col overflow-y-auto max-h-[calc(68vh)] w-full`}>
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
      )}

      {messages.length === 0 && (
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
      />
    </section>
  );
}

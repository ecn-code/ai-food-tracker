import { KeyboardEvent, useState, useRef, useEffect } from "react";

export type TRACK_TYPE = { id: string, date: Date | null, name: string, messages: Array<string> };

export default function Track({ track }: { track: TRACK_TYPE }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(track.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const handleEnterPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setMessages(
        [...messages, text]
      );
      setText('')
    }
  };

  useEffect(() => {
    setMessages(track.messages)
  }, [track]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex flex-col items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4">
      <div className={`flex flex-1 flex-col overflow-y-auto ${messages.length == 0 ? 'max-h-[calc(34vh)]' : 'max-h-[calc(68vh)]'} w-full`}>
        <div className="flex flex-col gap-2 flex-1">
          {messages.map((message, index) => (
            <p key={index} className="bg-gray-100 p-2 rounded">{message}</p>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {messages.length === 0 && (
        <h2 className="text-xl font-bold mb-4">
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

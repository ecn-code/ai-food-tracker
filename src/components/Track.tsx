import { KeyboardEvent, useState } from "react";

export type TRACK_TYPE = { id: string, date: Date | null, name: string, messages: Array<string> };

export default function Track({ track }: { track: TRACK_TYPE }) {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState(track.messages);
    const handleEnterPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          setMessages(
            [...messages, text]
          );
          setText('')
        }
      };

    return (
        <section
        className={`flex ${
            messages.length != 0 ? "flex-col-reverse" : "flex-col"
        } justify-center items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4`}
      >
        {
            messages.map(message => (
                <p>{message}</p>
            ))
        }
        {messages.length == 0 && <h2 className="text-xl font-bold mb-4">¿Que has comido?</h2>}
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-none"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleEnterPress}
          />
      </section>
    );
}

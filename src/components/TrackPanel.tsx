import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import { AIMessageType, RoleEnum, WorkFlowTaskEnum } from "../types";
import Track from "./models/Track";
import { WorkFlow } from "../services/ai/core/workflow";
import { GetIngredientInformation } from "../services/ai/getIngredientInformation";

export default function TrackPanel({ track, tracks, setTracks }: { track: Track, tracks: Array<Track>, setTracks: (tracks: Array<Track>) => void,
 }) {
  const workflowRef = useRef<WorkFlow | null>(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<AIMessageType[]>([]);
  const [disabled, setDisabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const run = async () => {
    console.log('Running state');
    const response = await workflowRef.current!.run();
    console.log(response)
    setMessages(prev => [...prev, response]);
    setDisabled(false);
  };

  // Ejecutar solo una vez al montar
  useEffect(() => {

    console.log('useEffect', track.id);
    workflowRef.current = WorkFlow.builder('START')
    .registerState("GetIngredientInformation", GetIngredientInformation)
    .states([
      {type: WorkFlowTaskEnum.USER_INPUT, feedback: "Introduce un ingrediente", name: "START", nextStateName: 'VALIDAR'},
      {type: WorkFlowTaskEnum.AI_GATE, prompt: "Determine whether the text between the bars is an ingredient used in cooking or food preparation.", name: "VALIDAR", branches: {
        "INGREDIENT": {checkDescription: "Es un ingrediente", nextStateName: "IS_INGREDIENT"},
        "NON_INGREDIENT": {checkDescription: "No es un ingrediente", nextStateName: "START"}
      }
      },
      {type: WorkFlowTaskEnum.AI_AUTO_TASK, prompt: "Translate to English only or rename if it needed the name between the vertical bars. Respond with the translated name only.", name: "IS_INGREDIENT", nextStateName: "LAST"},
      {type: WorkFlowTaskEnum.CUSTOM_TASK, custom_type: "GetIngredientInformation", name: "LAST", nextStateName: null},
    ])
    .build();

    run();

    return () => {
      setMessages([]);
      setDisabled(false);
      setText('');
      workflowRef.current = null;
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
    workflowRef.current?.setUserInput(text);

    const updatedTracks = tracks.map(t => 
      t.id === track.id ? { ...t, name: text } : t
    );
    setTracks(updatedTracks);

    setText('');
    setDisabled(true);

    run();
  };

  return (
    <section className="flex flex-col items-center bg-white shadow-lg rounded-lg w-full h-full transition-all border border-gray-200 p-4">
      {messages.length > 0 ? (
        <div className="flex flex-1 flex-col overflow-y-auto max-h-[calc(68vh)] w-full">
          <div className="flex flex-col gap-2 flex-1">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`} // Updated key to include role and index for uniqueness
                className={`p-2 rounded max-w-[75%] ${message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
              >
                {message.content.split('\n').map((text, i) => (
                  <React.Fragment key={i}> {/* Added key for nested map */}
                    {text}
                    <br />
                  </React.Fragment>
                ))}
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

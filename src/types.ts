import { Context } from "./services/ai/workflow/context";
import { State } from "./services/ai/workflow/state";

export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANTE = 'assistant'
};

export type AIMessageType = { role: RoleEnum, content: string };
export type AIResponseType = { message: AIMessageType };
export type ConstructorState = (context: Context) => State;
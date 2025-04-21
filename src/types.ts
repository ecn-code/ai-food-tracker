import { Context } from "./services/ai/workflow/context";
import { State } from "./services/ai/core/state";

export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
};

export type AIMessageType = { role: RoleEnum, content: string };
export type ConstructorState = (context: Context) => State;
export type GateBranch = {description: string, state: State};
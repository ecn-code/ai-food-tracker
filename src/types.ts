import { Context } from "./services/ai/workflow/context";
import { State } from "./services/ai/core/state";

export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
};

export type AIMessageType = { role: RoleEnum, content: string };
export type Constructor<T extends State> = new (state: StateDef, context: Context) => T;


export enum WorkFlowTaskEnum {
  USER_INPUT = 'UserInput',
  AI_GATE = 'AIGate',
  AI_AUTO_TASK = 'AIAutoTask'
};
export type BranchDef = NextState & {
  checkDescription: string;
};
type BaseState = {
  name: string;
};
type NextState = {
  nextStateName: string | null;
};
type AIBaseState = BaseState & {
  prompt: string;
};

export type UserInputState = BaseState & NextState & {
  type: WorkFlowTaskEnum.USER_INPUT;
  feedback: string;
};

export type AIGateState = AIBaseState & {
  type: WorkFlowTaskEnum.AI_GATE;
  branches: Record<string, BranchDef>;
};

export type AIAutoTaskState = AIBaseState & NextState & {
  type: WorkFlowTaskEnum.AI_AUTO_TASK;
};

export type StateDef = UserInputState | AIGateState | AIAutoTaskState;
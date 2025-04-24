import { Context } from "./services/ai/workflow/context";
import { State } from "./services/ai/core/state";

export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
};

export type AIMessageType = { role: RoleEnum, content: string };
export type ConstructorState = (context: Context) => State;


export enum WorkFlowTaskEnum {
  USER_INPUT = 'UserInput',
  AI_GATE = 'AIGate',
  AI_AUTO_TASK = 'AIAutoTask'
};
export type BranchDef = {
  nextStateName: string;
  checkDescription: string;
};
type BaseState = {
  name: string;
  nextStateName: string | null;
};
type AIBaseState = BaseState & {
  prompt: string;
};

type UserInputState = BaseState & {
  type: WorkFlowTaskEnum.USER_INPUT;
  feedback: string;
};

type AIGateState = AIBaseState & {
  type: WorkFlowTaskEnum.AI_GATE;
  branches: Map<string, BranchDef>;
};

type AIAutoTaskState = AIBaseState & {
  type: WorkFlowTaskEnum.AI_AUTO_TASK;
};

export type StateDef = UserInputState | AIGateState | AIAutoTaskState;
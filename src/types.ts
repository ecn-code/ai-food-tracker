export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANTE = 'assistant'
};

export type TrackType = { id: string, date: Date | null, name: string, messages: Array<AIMessageType> };

export type AIMessageType = {role: RoleEnum, content: string};
export enum RoleEnum {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANTE = 'assistant'
};

export type AIMessageType = { role: RoleEnum, content: string };
export type AIResponseType = { message: AIMessageType };
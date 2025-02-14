import { Message } from "./Message";

export type Conversation = {
  id: string;
  userAgent: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

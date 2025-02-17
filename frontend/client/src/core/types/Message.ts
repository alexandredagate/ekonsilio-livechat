import { User } from "./User";

export type Message = {
  id: string;
  text: string;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
  operator?: User;
};
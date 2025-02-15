import { Conversation } from "./Conversation";
import { User } from "./User";

export type Message = {
  id: string;
  text: string;
  conversation: Conversation;
  createdAt: Date;
  updatedAt: Date;
  operator?: User;
};
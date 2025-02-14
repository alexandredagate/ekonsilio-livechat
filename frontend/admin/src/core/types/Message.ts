import { User } from "./User";

export type Message = {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  operator?: User;
};
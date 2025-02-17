import { Request } from "../functions/Request";
import { Conversation } from "../types/Conversation";

export class ConversationService {
  static async GetAllConversations(): Promise<Conversation[]> {
    return Request<Conversation[]>("/conversation");
  }

  static async GetConversation(id: string): Promise<Conversation> {
    return Request<Conversation>(`/conversation/${id}`);
  }
}
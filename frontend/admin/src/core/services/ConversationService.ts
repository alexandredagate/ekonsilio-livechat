import { Request } from "../functions/Request";
import { Conversation } from "../types/Conversation";

export class ConversationService {
  static async GetAllConversations(): Promise<Conversation[]> {
    return Request<Conversation[]>("/conversation");
  }
  
  static async CloseConversation(conversationId: string): Promise<Conversation> {
    return Request<Conversation>(`/conversation/close-conversation/${conversationId}`, "PATCH");
  }
}
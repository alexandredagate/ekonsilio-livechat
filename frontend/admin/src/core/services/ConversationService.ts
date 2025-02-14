import { Request } from "../functions/Request";
import { Conversation } from "../types/Conversation";

export class ConversationService {
  static async GetAllConversations(): Promise<Conversation[]> {
    return Request<Conversation[]>("/conversation");
  }
}
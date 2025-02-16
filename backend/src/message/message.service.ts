import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class MessageService {
  constructor (
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) { }

  async CreateMessage(conversationId: string, text: string, operatorId?: string): Promise<Message | null> {
    const message = await this.messageRepository.save({
      conversation: { id: conversationId },
      text,
      operator: { id: operatorId },
    });

    return this.messageRepository.findOneBy({ id: message.id });
  }
}
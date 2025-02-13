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

  async CreateMessage(conversationId: string, text: string, operator?: User): Promise<Message> {
    const message = this.messageRepository.create({
      conversation: { id: conversationId },
      text,
      operator,
    });

    return this.messageRepository.save(message);
  }
}
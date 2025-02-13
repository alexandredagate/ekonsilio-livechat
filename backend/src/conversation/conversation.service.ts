import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { Repository } from "typeorm";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class ConversationService {
  constructor (
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) { }

  async FindAll(): Promise<Conversation[]> {
    return this.conversationRepository.find();
  }

  async FindOne(id: string): Promise<Conversation | null> {
    return this.conversationRepository.findOneBy({ id });
  }

  async Create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create(createConversationDto);

    return this.conversationRepository.save(conversation);
  }
}
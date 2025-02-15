import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { Repository } from "typeorm";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { isUUID } from "class-validator";

@Injectable()
export class ConversationService {
  constructor (
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) { }

  async FindAll(): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.messages", "message")
      .leftJoinAndSelect("message.operator", "operator")
      .leftJoin(
        (subQuery) =>
          subQuery
            .select("m.conversationId", "conversation_id") // 🔥 Alias correct
            .addSelect("MAX(m.createdAt)", "last_message_date") // 🔥 On récupère la date du dernier message
            .from("message", "m")
            .groupBy("m.conversationId"),
        "last_message", // 🔥 Alias bien défini
        "last_message.conversation_id = conversation.id" // 🔥 Utilisation correcte de l'alias
      )
      .orderBy("last_message.last_message_date", "DESC") // 🔥 Trier les conversations par dernier message DESC
      .addOrderBy("message.createdAt", "ASC") // 🔥 Trier les messages par ordre ASC
      .getMany();
  }

  async FindOne(id: string): Promise<Conversation | null> {
    return this.conversationRepository.findOneBy({ id });
  }

  async Create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create(createConversationDto);

    return this.conversationRepository.save(conversation);
  }

  async Exists(id: string): Promise<boolean> {
    if (!isUUID(id)) return false;
    
    return this.conversationRepository.exists({ where: { id }});
  }
}
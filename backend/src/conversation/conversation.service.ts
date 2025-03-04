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

  async FindAllFor(user: string, activeOnly: boolean = false): Promise<Conversation[]> {
    let sql = this.conversationRepository
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.messages", "message")
      .leftJoinAndSelect("message.operator", "operator")
      .leftJoin(
        (subQuery) =>
          subQuery
            .select("m.conversationId", "conversation_id")
            .addSelect("MAX(m.createdAt)", "last_message_date")
            .from("message", "m")
            .groupBy("m.conversationId"),
        "last_message",
        "last_message.conversation_id = conversation.id"
      )
      .orderBy("last_message.last_message_date", "DESC")
      .addOrderBy("message.createdAt", "ASC")
      .where("conversation.operatorId = :operator", { operator: user });

      if (activeOnly) {
        sql = sql.andWhere("conversation.active = true");
      }

      return sql.getMany();
  }

  async FindOne(id: string): Promise<Conversation | null> {
    return this.conversationRepository.findOneBy({ id, active: true });
  }

  async CountActiveFor(userId: string): Promise<number> {
    return this.conversationRepository.count({
      where: {
        operator: {
          id: userId
        }
      }
    });
  }

  async Create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create({
      userAgent: createConversationDto.userAgent,
      operator: { id: createConversationDto.operator },
      messages: [
        { text: createConversationDto.message }
      ]
    });

    return this.conversationRepository.save(conversation);
  }

  async Close(id: string) {
    return this.conversationRepository.save({ id, active: false });
  }

  async Exists(id: string): Promise<boolean> {
    if (!isUUID(id)) return false;
    
    return this.conversationRepository.exists({ where: { id }});
  }

  async IsActive(id: string): Promise<boolean> {
    if (!isUUID(id)) return false;
    
    return this.conversationRepository.exists({ where: { id, active: true }});
  }
}
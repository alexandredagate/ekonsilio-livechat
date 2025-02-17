import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Conversation } from "./conversation.entity";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { AuthUser } from "../auth/auth-user";
import { User } from "../user/user.entity";

@Controller("conversation")
export class ConversationController {
  constructor (
    private readonly conversationService: ConversationService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async FindAllConversations(@AuthUser() user: User): Promise<Conversation[]> {
    return this.conversationService.FindAllFor(user.id);
  }

  @Get(":id")
  async FindConversation(@Param("id") id: string): Promise<Conversation> {
    const conversation = await this.conversationService.FindOne(id);

    if (!conversation) throw new NotFoundException();

    return conversation;
  }
}
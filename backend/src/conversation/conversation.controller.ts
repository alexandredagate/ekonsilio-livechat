import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Conversation } from "./conversation.entity";
import { AuthUser } from "../auth/auth-user";
import { User } from "../user/user.entity";

@Controller("conversation")
export class ConversationController {
  constructor (
    private readonly conversationService: ConversationService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async FindAllConversations(@AuthUser() user: User, @Query() query: any): Promise<Conversation[]> {
    if (query.includeInactive) return this.conversationService.FindAllFor(user.id, false);

    return this.conversationService.FindAllFor(user.id, true);
  }

  @Get(":id")
  async FindConversation(@Param("id") id: string): Promise<Conversation> {
    const conversation = await this.conversationService.FindOne(id);

    if (!conversation) throw new NotFoundException();

    return conversation;
  }

  @Patch("close-conversation/:id")
  async CloseConversation(@Param("id") id: string): Promise<Conversation> {
    const exists = await this.conversationService.Exists(id);
    
    if (!exists) throw new NotFoundException();

    return this.conversationService.Close(id);
  }
}
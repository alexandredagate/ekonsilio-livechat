import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Conversation } from "./conversation.entity";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Controller("conversation")
export class ConversationController {
  constructor (
    private readonly conversationService: ConversationService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async FindAllConversations(): Promise<Conversation[]> {
    return this.conversationService.FindAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async FindConversation(@Param("id") id: string): Promise<Conversation> {
    const conversation = await this.conversationService.FindOne(id);

    if (!conversation) throw new NotFoundException();

    return conversation;
  }

  @Post()
  async CreateConversation(@Body() createConversationDto: CreateConversationDto): Promise<Conversation> {
    return this.conversationService.Create(createConversationDto);
  }
}
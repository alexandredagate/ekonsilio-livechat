import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "./conversation.entity";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation])
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule { }
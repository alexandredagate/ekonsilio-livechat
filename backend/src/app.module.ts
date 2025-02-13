import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveChatDataSource } from '../Database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(LiveChatDataSource),
    UserModule,
    AuthModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

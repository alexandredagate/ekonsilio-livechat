import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveChatDataSource } from '../Database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(LiveChatDataSource),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: "24h" },
      global: true,
    }),
    UserModule,
    AuthModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}

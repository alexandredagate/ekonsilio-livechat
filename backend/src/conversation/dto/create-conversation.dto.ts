import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  userAgent?: string;
}
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsUUID()
  @IsNotEmpty()
  operator: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
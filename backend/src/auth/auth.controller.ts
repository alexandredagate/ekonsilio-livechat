import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Login as LoginType } from "../core/types/login.type";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Request as Req } from "express";
import { User } from "../user/user.entity";

@Controller("auth")
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  async Login(@Body() loginDto: LoginDto): Promise<LoginType> {
    const user = await this.authService.ValidateUser(loginDto.username, loginDto.password);
    return this.authService.Login(user);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  Me(@Request() req: Req): User {
    return req.user! as User;
  }
}
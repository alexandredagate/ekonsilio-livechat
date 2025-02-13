import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Login as LoginType } from "../core/types/login.type";

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
}
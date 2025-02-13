import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Login as LoginType } from "../core/types/login.type";

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async ValidateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      select: ["id", "password", "username"] // Manually select because password is excluded by default
    });

    if (!user) throw new NotFoundException(); // No user was found w/ this username

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) throw new ForbiddenException(); // Password mismatch
    
    return user;
  }

  async Login(user: User): Promise<LoginType> {
    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
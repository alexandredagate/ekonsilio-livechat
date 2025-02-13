import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async FindAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async FindOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async FindOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }
}
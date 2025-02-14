import { Request } from "../functions/Request";
import { User } from "../types/User";
import { Login as LoginType } from "../types/Login";

export class AuthService {
  static async Me(): Promise<User> {
    return Request<User>('/auth/me');
  }

  static async Login(username: string, password: string): Promise<LoginType> {
    return Request<LoginType>('/auth/login', "POST", { username, password });
  }
}

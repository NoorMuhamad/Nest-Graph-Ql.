import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userName: string, password: string): Promise<any> {
    console.log(process.env.JWT_SECRET_KEY);
    const user = this.usersService.findOne(userName);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    return {
      access_token: this.jwtService.sign({
        userName: user.userName,
        sub: user.id,
      }),
      user,
    };
  }
}

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

  async validateUser(username: string, password: string): Promise<any> {
    const users = await this.usersService.findOne(username);

    if (users && users.length > 0) {
      const user = users[0];
      if (user.password === password) {
        const result = { ...user };
        delete result.password;
        return result;
      }
    }
    return null;
  }

  async login(user: User): Promise<any> {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
        role: user.role,
      }),
      user,
    };
  }
}

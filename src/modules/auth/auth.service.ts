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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
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
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user,
    };
  }
}

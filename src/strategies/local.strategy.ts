import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName',
    }); // Automatically calling the constructor of the PassportStrategy also usernameField should be same
  }

  async validate(userName: string, password: string): Promise<any> {
    const user = this.authService.validateUser(userName, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

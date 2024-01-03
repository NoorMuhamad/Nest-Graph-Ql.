import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './entities/login.response';
import { LoginInput } from './entities/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    return this.authService.login(context.user);
  }
}

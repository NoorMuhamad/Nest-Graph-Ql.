import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import RoleGuard from 'src/guards/role.guard';
import { UserRole } from 'src/enums';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.ADMIN))
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<User[]> {
    try {
      const users = await this.usersService.findAll(
        limit,
        offset,
        sortBy,
        sortOrder,
        search,
      );

      if (!Array.isArray(users)) {
        throw new BadRequestException('Invalid data returned from service.');
      }

      return users;
    } catch (error) {
      throw new BadRequestException('Failed to fetch users.');
    }
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('username', { type: () => String }) username: string,
  ): Promise<User[]> {
    try {
      const user = await this.usersService.findOne(username);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user.');
    }
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    try {
      return await this.usersService.create(createUserInput);
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
    }
  }
}

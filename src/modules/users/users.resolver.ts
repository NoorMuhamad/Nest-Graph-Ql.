import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserResult } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import RoleGuard from 'src/guards/role.guard';
import { UserRole } from 'src/enums';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResult, { name: 'users' })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(UserRole.ADMIN))
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<UserResult> {
    try {
      const { data, totalPages, currentPage } = await this.usersService.findAll(
        page,
        limit,
        sortBy,
        sortOrder,
        search,
      );
      return { data, totalPages, currentPage };
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

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.usersService.update(updateUserInput);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error.message);
      throw new BadRequestException('Failed to update user.');
    }
  }
}

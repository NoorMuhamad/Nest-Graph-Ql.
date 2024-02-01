import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { UserRole } from 'src/enums';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import RoleGuard from 'src/guards/role.guard';
import { User, UserResult } from './entities/user.entity';
import { CreateUserType } from './types/create.user';
import { UpdateUserType } from './types/update.user';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResult, { name: 'users' })
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
  ): Promise<User> {
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
  @UseGuards(RoleGuard([UserRole.OWNER, UserRole.ADMIN]))
  async createUser(
    @Args('createUserType') createUserType: CreateUserType,
  ): Promise<User> {
    try {
      return await this.usersService.create(createUserType);
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserType') updateUserType: UpdateUserType,
  ): Promise<User> {
    try {
      const updatedUser = await this.usersService.update(updateUserType);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error.message);
      throw new BadRequestException('Failed to update user.');
    }
  }

  @Mutation(() => BaseResponse, { name: 'deleteUser' })
  async deleteUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.usersService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete user.');
    }
  }
}

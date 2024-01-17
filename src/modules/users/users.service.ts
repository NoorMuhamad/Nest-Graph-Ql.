import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { User } from './entities/user.entity';
import { CreateUserType } from './types/create.user';
import { UpdateUserType } from './types/update.user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user.
   * @param createUserInput - The user data to be created.
   * @returns The created user.
   */
  async create(createUserType: CreateUserType): Promise<User> {
    try {
      const user = this.userRepository.create(createUserType);
      return this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  /**
   * Find all users with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of users.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<{ data: User[]; totalPages: number; currentPage: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where('user.username LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`user.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: users, totalPages, currentPage: page };
  }

  /**
   * Find a user by username.
   * @param username - The username to search for.
   * @returns The found user.
   */
  findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * Update an existing user.
   * @param updateUserInput - The updated user data.
   * @returns The updated user.
   */
  async update(updateUserType: UpdateUserType): Promise<User> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateUserType;

      const existingUser = await this.userRepository.findOne({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(
          `User with ID ${updateUserType.id} not found.`,
        );
      }

      // Update user fields individually
      Object.assign(existingUser, updateData);
      return this.userRepository.save(existingUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  }

  /**
   * Find a user by username.
   * @param username - The username to search for.
   * @returns The found user.
   */
  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.userRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'User deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'User not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete user.' };
    }
  }
}

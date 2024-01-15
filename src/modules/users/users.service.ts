import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = this.userRepository.create(createUserInput);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  async findAll(
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<User[]> {
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

    queryBuilder.skip(offset).take(limit);

    return await queryBuilder.getMany();
  }

  findOne(username: string): Promise<User[]> {
    return this.userRepository.find({
      where: { username },
    });
  }
}

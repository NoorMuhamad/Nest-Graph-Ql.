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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findOne(username: string): Promise<User[]> {
    return this.userRepository.find({
      where: { username },
    });
  }
}

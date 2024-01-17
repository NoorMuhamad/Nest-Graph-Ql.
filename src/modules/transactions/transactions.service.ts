import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import {
  Transaction,
  TransactionResponse,
} from './entities/transactions.entity';
import { CreateTransactionType } from './types/create.transactions';
import { UpdateTransactionType } from './types/update.transactions';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Create a new Bill.
   * @param createBillType - The Bill data to be created.
   * @returns The created Bill.
   */
  async create(
    createTransactionType: CreateTransactionType,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionRepository.create(
        createTransactionType,
      );
      return this.transactionRepository.save(transaction);
    } catch (error) {
      console.error('Error creating transaction : ', error.message);
      throw error;
    }
  }

  /**
   * Find all Bills with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of Bills.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<TransactionResponse> {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    if (search) {
      queryBuilder.where('transaction.paymentMethod LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`transaction.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [Bills, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: Bills, totalPages, currentPage: page };
  }

  /**
   * Find a Bill by billingDate.
   * @param Bill - The Bill to search for.
   * @returns The found Bill.
   */
  findOne(paymentMethod: string): Promise<Transaction | undefined> {
    return this.transactionRepository.findOne({
      where: { paymentMethod },
    });
  }

  /**
   * Update an existing Transaction.
   * @param updateTransactionType - The updated Transaction data.
   * @returns The updated Transaction.
   */
  async update(
    updateTransactionType: UpdateTransactionType,
  ): Promise<Transaction> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateTransactionType;

      const existingBill = await this.transactionRepository.findOne({
        where: { id },
      });

      if (!existingBill) {
        throw new NotFoundException(
          `Bill with ID ${existingBill.id} not found.`,
        );
      }

      // Update Bill fields individually
      Object.assign(existingBill, updateData);
      return this.transactionRepository.save(existingBill);
    } catch (error) {
      console.error('Error updating Bill:', error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.transactionRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Transactions deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Transactions not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete Transactions.' };
    }
  }
}

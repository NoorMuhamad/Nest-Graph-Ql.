import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import {
  Transaction,
  TransactionResponse,
} from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionType } from './types/create.transactions';
import { UpdateTransactionType } from './types/update.transactions';

@Resolver(() => Transaction)
@UseGuards(JwtAuthGuard)
export class TransactionsResolver {
  constructor(private readonly transactionService: TransactionsService) {}

  @Query(() => TransactionResponse, { name: 'transactions' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<TransactionResponse> {
    try {
      const { data, totalPages, currentPage } =
        await this.transactionService.findAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search,
        );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions.');
    }
  }

  @Query(() => Transaction, { name: 'Transaction' })
  async findOne(
    @Args('paymentMethod', { type: () => String }) paymentMethod: string,
  ): Promise<Transaction> {
    try {
      const transaction = await this.transactionService.findOne(paymentMethod);

      if (!transaction) {
        throw new NotFoundException('transaction not found.');
      }

      return transaction;
    } catch (error) {
      throw new BadRequestException('Failed to fetch transaction.');
    }
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionType') createTransactionType: CreateTransactionType,
  ): Promise<Transaction> {
    try {
      return await this.transactionService.create(createTransactionType);
    } catch (error) {
      throw new BadRequestException('Failed to create Transaction.');
    }
  }

  @Mutation(() => Transaction)
  async updateBill(
    @Args('updateTransactionType') updateTransactionType: UpdateTransactionType,
  ): Promise<Transaction> {
    try {
      const updatedTransaction = await this.transactionService.update(
        updateTransactionType,
      );
      return updatedTransaction;
    } catch (error) {
      console.error('Failed to update transaction:', error.message);
      throw new BadRequestException('Failed to update transaction.');
    }
  }

  @Query(() => BaseResponse, { name: 'deleteTransaction' })
  async deleteBill(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.transactionService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete transaction.');
    }
  }
}

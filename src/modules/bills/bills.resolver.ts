import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { BillsService } from './bills.service';
import { Bill, BillResponse } from './entities/bill.entity';
import { CreateBillType } from './types/create.bill';
import { UpdateBillType } from './types/update.bill';

@Resolver(() => Bill)
@UseGuards(JwtAuthGuard)
export class BillsResolver {
  constructor(private readonly billService: BillsService) {}

  @Query(() => BillResponse, { name: 'bills' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<BillResponse> {
    try {
      const { data, totalPages, currentPage } = await this.billService.findAll(
        page,
        limit,
        sortBy,
        sortOrder,
        search,
      );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch bills.');
    }
  }

  @Query(() => Bill, { name: 'bill' })
  async findOne(
    @Args('billingDate', { type: () => Date }) billingDate: Date,
  ): Promise<Bill> {
    try {
      const bill = await this.billService.findOne(billingDate);

      if (!bill) {
        throw new NotFoundException('bill not found.');
      }

      return bill;
    } catch (error) {
      throw new BadRequestException('Failed to fetch bill.');
    }
  }

  @Mutation(() => Bill)
  async createBill(
    @Args('createBillType') createBillType: CreateBillType,
  ): Promise<Bill> {
    try {
      return await this.billService.create(createBillType);
    } catch (error) {
      throw new BadRequestException('Failed to create Bill.');
    }
  }

  @Mutation(() => Bill)
  async updateBill(
    @Args('updateBillType') updateBillType: UpdateBillType,
  ): Promise<Bill> {
    try {
      const updatedBill = await this.billService.update(updateBillType);
      return updatedBill;
    } catch (error) {
      console.error('Failed to update bill:', error.message);
      throw new BadRequestException('Failed to update bill.');
    }
  }

  @Query(() => BaseResponse, { name: 'deleteBill' })
  async deleteBill(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.billService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete bill.');
    }
  }
}

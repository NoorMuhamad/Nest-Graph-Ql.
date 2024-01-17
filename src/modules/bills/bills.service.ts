import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { Bill, BillResponse } from './entities/bill.entity';
import { CreateBillType } from './types/create.bill';
import { UpdateBillType } from './types/update.bill';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  /**
   * Create a new Bill.
   * @param createBillType - The Bill data to be created.
   * @returns The created Bill.
   */
  async create(createBillType: CreateBillType): Promise<Bill> {
    try {
      const Bill = this.billRepository.create(createBillType);
      return this.billRepository.save(Bill);
    } catch (error) {
      console.error('Error creating Bill:', error.message);
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
  ): Promise<BillResponse> {
    const queryBuilder = this.billRepository.createQueryBuilder('Bill');

    if (search) {
      queryBuilder.where('Bill.subject LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`Bill.${sortBy}`, order);
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
  findOne(billingDate: Date): Promise<Bill | undefined> {
    return this.billRepository.findOne({
      where: { billingDate },
    });
  }

  /**
   * Update an existing Bill.
   * @param updateBillType - The updated Bill data.
   * @returns The updated Bill.
   */
  async update(updateBillType: UpdateBillType): Promise<Bill> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateBillType;

      const existingBill = await this.billRepository.findOne({
        where: { id },
      });

      if (!existingBill) {
        throw new NotFoundException(
          `Bill with ID ${existingBill.id} not found.`,
        );
      }

      // Update Bill fields individually
      Object.assign(existingBill, updateData);
      return this.billRepository.save(existingBill);
    } catch (error) {
      console.error('Error updating Bill:', error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.billRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Bill deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Bill not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete Bill.' };
    }
  }
}

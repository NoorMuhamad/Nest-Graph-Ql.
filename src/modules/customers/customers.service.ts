import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { Customer, CustomerResponse } from './entities/customer.entity';
import { CreateCustomerType } from './types/create.customer';
import { UpdateCustomerType } from './types/update.customer';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * Create a new Customer.
   * @param createCustomerType - The customer data to be created.
   * @returns The created customer.
   */
  async create(createCustomerType: CreateCustomerType): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerType);
      return this.customerRepository.save(customer);
    } catch (error) {
      console.error('Error creating customer:', error.message);
      throw error;
    }
  }

  /**
   * Find all customers with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of customers.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<CustomerResponse> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    if (search) {
      queryBuilder.where('customer.firstName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`customer.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [customers, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: customers, totalPages, currentPage: page };
  }

  /**
   * Find a customer by firstName.
   * @param firstName - The firstName to search for.
   * @returns The found customer.
   */
  findOne(firstName: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: { firstName },
    });
  }

  /**
   * Update an existing customer.
   * @param updateCustomerType - The updated customer data.
   * @returns The updated customer.
   */
  async update(updateCustomerType: UpdateCustomerType): Promise<Customer> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateCustomerType;

      const existingCustomer = await this.customerRepository.findOne({
        where: { id },
      });

      if (!existingCustomer) {
        throw new NotFoundException(
          `Customer with ID ${updateCustomerType.id} not found.`,
        );
      }

      // Update Customer fields individually
      Object.assign(existingCustomer, updateData);
      return this.customerRepository.save(existingCustomer);
    } catch (error) {
      console.error('Error updating customer:', error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.customerRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Customer deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Customer not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete customer.' };
    }
  }
}

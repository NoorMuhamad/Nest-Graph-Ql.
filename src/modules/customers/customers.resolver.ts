import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { CustomersService } from './customers.service';
import { Customer, CustomerResponse } from './entities/customer.entity';
import { CreateCustomerType } from './types/create.customer';
import { UpdateCustomerType } from './types/update.customer';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomersResolver {
  constructor(private readonly customerService: CustomersService) {}

  @Query(() => CustomerResponse, { name: 'customers' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<CustomerResponse> {
    try {
      const { data, totalPages, currentPage } =
        await this.customerService.findAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search,
        );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch customers.');
    }
  }

  @Query(() => Customer, { name: 'customer' })
  async findOne(
    @Args('firstName', { type: () => String }) firstName: string,
  ): Promise<Customer> {
    try {
      const customer = await this.customerService.findOne(firstName);

      if (!customer) {
        throw new NotFoundException('customer not found.');
      }

      return customer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch customer.');
    }
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('createCustomerType') createCustomerType: CreateCustomerType,
  ): Promise<Customer> {
    try {
      return await this.customerService.create(createCustomerType);
    } catch (error) {
      throw new BadRequestException('Failed to create customer.');
    }
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('updateCustomerType') updateCustomerType: UpdateCustomerType,
  ): Promise<Customer> {
    try {
      const updatedCustomer =
        await this.customerService.update(updateCustomerType);
      return updatedCustomer;
    } catch (error) {
      console.error('Failed to update customer:', error.message);
      throw new BadRequestException('Failed to update customer.');
    }
  }

  @Query(() => BaseResponse, { name: 'deleteCustomer' })
  async deleteCustomer(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.customerService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete customer.');
    }
  }
}

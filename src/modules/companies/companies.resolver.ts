import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { CompaniesService } from './companies.service';
import { Company, CompanyResult } from './entities/company.entity';
import { CreateCompanyType } from './types/create.company';
import { UpdateCompanyType } from './types/update.company';

@Resolver(() => Company)
@UseGuards(JwtAuthGuard)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => CompanyResult, { name: 'companies' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<CompanyResult> {
    try {
      const { data, totalPages, currentPage } =
        await this.companiesService.findAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search,
        );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch companies.');
    }
  }

  @Query(() => Company, { name: 'company' })
  async findOne(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Company> {
    try {
      const company = await this.companiesService.findOne(name);

      if (!company) {
        throw new NotFoundException('Company not found.');
      }

      return company;
    } catch (error) {
      throw new BadRequestException('Failed to fetch company.');
    }
  }

  @Mutation(() => Company)
  async createCompany(
    @Args('createCompanyType') createCompanyType: CreateCompanyType,
  ): Promise<Company> {
    try {
      return await this.companiesService.create(createCompanyType);
    } catch (error) {
      throw new BadRequestException('Failed to create company.');
    }
  }

  @Mutation(() => Company)
  async updateCompany(
    @Args('updateCompanyType') updateCompanyType: UpdateCompanyType,
  ): Promise<Company> {
    try {
      const updatedCompany =
        await this.companiesService.update(updateCompanyType);
      return updatedCompany;
    } catch (error) {
      console.error('Failed to update company:', error.message);
      throw new BadRequestException('Failed to update company.');
    }
  }

  @Mutation(() => BaseResponse, { name: 'deleteCompany' })
  async deleteCompany(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.companiesService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete company.');
    }
  }
}

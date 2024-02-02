import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { Company } from './entities/company.entity';
import { CreateCompanyType } from './types/create.company';
import { UpdateCompanyType } from './types/update.company';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  /**
   * Create a new company.
   * @param createCompanyInput - The company data to be created.
   * @returns The created company.
   */
  async create(createCompanyType: CreateCompanyType): Promise<Company> {
    try {
      const company = this.companyRepository.create(createCompanyType);
      return this.companyRepository.save(company);
    } catch (error) {
      console.error('Error creating company:', error.message);
      throw error;
    }
  }

  /**
   * Find all company with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of companies.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<{ data: Company[]; totalPages: number; currentPage: number }> {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    // Assuming these are your searchable fields in the GraphQL schema
    const searchableFields = ['name', 'ownerName', 'cnic', 'id', 'role'];

    if (search) {
      const conditions = searchableFields
        .map((field) => `company.${field} LIKE :search`)
        .join(' OR ');

      queryBuilder.where(`(${conditions})`, {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`company.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [companies, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: companies, totalPages, currentPage: page };
  }

  /**
   * Find a company by email.
   * @param email - The email to search for.
   * @returns The found company.
   */
  findOne(email: string): Promise<Company | undefined> {
    return this.companyRepository.findOne({
      where: { email },
    });
  }

  /**
   * Update an existing company.
   * @param updateCompanyInput - The updated company data.
   * @returns The updated company.
   */
  async update(updateCompanyType: UpdateCompanyType): Promise<Company> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateCompanyType;

      const existingCompany = await this.companyRepository.findOne({
        where: { id },
      });

      if (!existingCompany) {
        throw new NotFoundException(
          `Company with ID ${updateCompanyType.id} not found.`,
        );
      }

      // Update company fields individually
      Object.assign(existingCompany, updateData);
      return this.companyRepository.save(existingCompany);
    } catch (error) {
      console.error('Error updating company:', error.message);
      throw error;
    }
  }

  /**
   * Find a company by companyName.
   * @param companyName - The companyName to search for.
   * @returns The found company.
   */
  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.companyRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Company deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Company not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete company.' };
    }
  }
}

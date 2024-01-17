import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { Package, PackageResponse } from './entities/package.entity';
import { CreatePackageType } from './types/create.package';
import { UpdatePackageType } from './types/update.package';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  /**
   * Create a new package.
   * @param createPackageType - The package data to be created.
   * @returns The created package.
   */
  async create(createPackageType: CreatePackageType): Promise<Package> {
    try {
      const newPackage = this.packageRepository.create(createPackageType);
      return this.packageRepository.save(newPackage);
    } catch (error) {
      console.error('Error creating package:', error.message);
      throw error;
    }
  }

  /**
   * Find all packages with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of packages.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<PackageResponse> {
    const queryBuilder = this.packageRepository.createQueryBuilder('package');

    if (search) {
      queryBuilder.where('package.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`package.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [packages, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: packages, totalPages, currentPage: page };
  }

  /**
   * Find a package by firstName.
   * @param firstName - The firstName to search for.
   * @returns The found package.
   */
  findOne(name: string): Promise<Package | undefined> {
    return this.packageRepository.findOne({
      where: { name },
    });
  }

  /**
   * Update an existing package.
   * @param updatePackageType - The updated package data.
   * @returns The updated package.
   */
  async update(updatePackageType: UpdatePackageType): Promise<Package> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updatePackageType;

      const existingPackage = await this.packageRepository.findOne({
        where: { id },
      });

      if (!existingPackage) {
        throw new NotFoundException(
          `Package with ID ${updatePackageType.id} not found.`,
        );
      }

      // Update Package fields individually
      Object.assign(existingPackage, updateData);
      return this.packageRepository.save(existingPackage);
    } catch (error) {
      console.error('Error updating package:', error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.packageRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Package deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Package not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete Package.' };
    }
  }
}

import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { Package, PackageResponse } from './entities/package.entity';
import { PackagesService } from './packages.service';
import { CreatePackageType } from './types/create.package';
import { UpdatePackageType } from './types/update.package';

@Resolver(() => Package)
@UseGuards(JwtAuthGuard)
export class PackagesResolver {
  constructor(private readonly packageService: PackagesService) {}

  @Query(() => PackageResponse, { name: 'packages' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<PackageResponse> {
    try {
      const { data, totalPages, currentPage } =
        await this.packageService.findAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search,
        );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch packages.');
    }
  }

  @Query(() => Package, { name: 'package' })
  async findOne(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Package> {
    try {
      const findPackage = await this.packageService.findOne(name);

      if (!findPackage) {
        throw new NotFoundException('package not found.');
      }

      return findPackage;
    } catch (error) {
      throw new BadRequestException('Failed to fetch package.');
    }
  }

  @Mutation(() => Package)
  async createPackage(
    @Args('createPackageType') createPackageType: CreatePackageType,
  ): Promise<Package> {
    try {
      return await this.packageService.create(createPackageType);
    } catch (error) {
      throw new BadRequestException('Failed to create package.');
    }
  }

  @Mutation(() => Package)
  async updatePackage(
    @Args('updatePackageType') updatePackageType: UpdatePackageType,
  ): Promise<Package> {
    try {
      const updatePackage = await this.packageService.update(updatePackageType);
      return updatePackage;
    } catch (error) {
      console.error('Failed to update package:', error.message);
      throw new BadRequestException('Failed to update package.');
    }
  }

  @Query(() => BaseResponse, { name: 'deletePackage' })
  async deletePackage(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.packageService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete package.');
    }
  }
}

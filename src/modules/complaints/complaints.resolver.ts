import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResponse } from 'src/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { ComplaintsService } from './complaints.service';
import { Complaint, ComplaintResponse } from './entities/complaint.entity';
import { CreateComplaintType } from './types/create.complaint';
import { UpdateComplaintType } from './types/update.complaint';

@Resolver(() => Complaint)
@UseGuards(JwtAuthGuard)
export class ComplaintsResolver {
  constructor(private readonly complaintService: ComplaintsService) {}

  @Query(() => ComplaintResponse, { name: 'complaints' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 10 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 0 }) limit: number,
    @Args('sortBy', { nullable: true }) sortBy: string,
    @Args('sortOrder', { defaultValue: 'ASC' }) sortOrder: 'ASC' | 'DESC',
    @Args('search', { nullable: true }) search: string,
  ): Promise<ComplaintResponse> {
    try {
      const { data, totalPages, currentPage } =
        await this.complaintService.findAll(
          page,
          limit,
          sortBy,
          sortOrder,
          search,
        );
      return { data, totalPages, currentPage };
    } catch (error) {
      throw new BadRequestException('Failed to fetch complaints.');
    }
  }

  @Query(() => Complaint, { name: 'complaint' })
  async findOne(
    @Args('subject', { type: () => String }) subject: string,
  ): Promise<Complaint> {
    try {
      const complaint = await this.complaintService.findOne(subject);

      if (!complaint) {
        throw new NotFoundException('complaint not found.');
      }

      return complaint;
    } catch (error) {
      throw new BadRequestException('Failed to fetch complaint.');
    }
  }

  @Mutation(() => Complaint)
  async createComplaint(
    @Args('createComplaintType') createComplaintType: CreateComplaintType,
  ): Promise<Complaint> {
    try {
      return await this.complaintService.create(createComplaintType);
    } catch (error) {
      throw new BadRequestException('Failed to create complaint.');
    }
  }

  @Mutation(() => Complaint)
  async updateComplaint(
    @Args('updateComplaintType') updateComplaintType: UpdateComplaintType,
  ): Promise<Complaint> {
    try {
      const updatedComplaint =
        await this.complaintService.update(updateComplaintType);
      return updatedComplaint;
    } catch (error) {
      console.error('Failed to update complaint:', error.message);
      throw new BadRequestException('Failed to update complaint.');
    }
  }

  @Query(() => BaseResponse, { name: 'deleteComplaint' })
  async deleteComplaint(
    @Args('id', { type: () => String }) id: string,
  ): Promise<BaseResponse> {
    try {
      return await this.complaintService.delete(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete complaint.');
    }
  }
}

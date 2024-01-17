import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseResponse } from 'src/common';
import { Complaint, ComplaintResponse } from './entities/complaint.entity';
import { CreateComplaintType } from './types/create.complaint';
import { UpdateComplaintType } from './types/update.complaint';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  /**
   * Create a new complaint.
   * @param createComplaintType - The complaint data to be created.
   * @returns The created complaint.
   */
  async create(createComplaintType: CreateComplaintType): Promise<Complaint> {
    try {
      const complaint = this.complaintRepository.create(createComplaintType);
      return this.complaintRepository.save(complaint);
    } catch (error) {
      console.error('Error creating complaint:', error.message);
      throw error;
    }
  }

  /**
   * Find all complaints with optional pagination and sorting.
   * @param page - The current page.
   * @param limit - The number of items per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The sort order ('ASC' or 'DESC').
   * @param search - The search string.
   * @returns Paginated list of complaints.
   */
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search: string,
  ): Promise<ComplaintResponse> {
    const queryBuilder =
      this.complaintRepository.createQueryBuilder('complaint');

    if (search) {
      queryBuilder.where('complaint.subject LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      const order: 'ASC' | 'DESC' =
        (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
      queryBuilder.orderBy(`complaint.${sortBy}`, order);
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [complaints, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: complaints, totalPages, currentPage: page };
  }

  /**
   * Find a complaint by subject.
   * @param complaint - The Complaint to search for.
   * @returns The found complaint.
   */
  findOne(subject: string): Promise<Complaint | undefined> {
    return this.complaintRepository.findOne({
      where: { subject },
    });
  }

  /**
   * Update an existing complaint.
   * @param updateComplaintType - The updated complaint data.
   * @returns The updated complaint.
   */
  async update(updateComplaintType: UpdateComplaintType): Promise<Complaint> {
    try {
      // Exclude the primary key from the update
      const { id, ...updateData } = updateComplaintType;

      const existingComplaint = await this.complaintRepository.findOne({
        where: { id },
      });

      if (!existingComplaint) {
        throw new NotFoundException(
          `Complaint with ID ${existingComplaint.id} not found.`,
        );
      }

      // Update Complaint fields individually
      Object.assign(existingComplaint, updateData);
      return this.complaintRepository.save(existingComplaint);
    } catch (error) {
      console.error('Error updating Complaint:', error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<BaseResponse> {
    try {
      const deleteResult = await this.complaintRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          success: true,
          message: 'Complaint deleted successfully.',
        };
      } else {
        return {
          success: false,
          message: 'Complaint not found or deletion failed.',
        };
      }
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      return { success: false, message: 'Failed to delete Complaint.' };
    }
  }
}

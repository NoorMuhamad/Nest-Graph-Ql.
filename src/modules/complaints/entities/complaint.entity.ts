import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseResponse, PaginatedResponse } from 'src/common';
import { ComplaintStatus } from 'src/enums';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(ComplaintStatus, {
  name: 'ComplaintStatus',
});

@ObjectType()
@Entity()
export class Complaint {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  subject: string;

  @Field()
  @Column()
  description: string;

  @Field(() => ComplaintStatus)
  @Column({
    type: 'enum',
    enum: ComplaintStatus,
  })
  status: ComplaintStatus;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Customer)
  @JoinColumn()
  @Field(() => Customer)
  customer: Customer;

  @ManyToOne(() => Company)
  @JoinColumn()
  @Field(() => Company)
  company: Company;
}

@ObjectType()
export class ComplaintResponse extends PaginatedResponse {
  @Field(() => [Complaint])
  data: Complaint[];
}

@ObjectType()
export class DeleteComplaint extends BaseResponse {}

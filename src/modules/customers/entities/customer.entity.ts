import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/index';
import { Bill } from 'src/modules/bills/entities/bill.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Complaint } from 'src/modules/complaints/entities/complaint.entity';
import { Package } from 'src/modules/packages/entities/package.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  cnic: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false, nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToMany(() => Package, (subscribedPackage) => subscribedPackage.customers)
  @JoinTable()
  packages: Package[];

  @ManyToOne(() => Company)
  @JoinColumn()
  @Field(() => Company)
  company: Company;

  @OneToMany(() => Complaint, (Complaint) => Complaint.customer)
  @Field(() => [Complaint])
  complaints: Complaint[];

  @OneToMany(() => Bill, (Bill) => Bill.customer)
  @Field(() => [Bill])
  Bills: Bill[];
}

@ObjectType()
export class CustomerResponse extends PaginatedResponse {
  @Field(() => [Customer])
  data: Customer[];
}

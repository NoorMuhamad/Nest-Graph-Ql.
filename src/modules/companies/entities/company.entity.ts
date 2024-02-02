import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Bill } from 'src/modules/bills/entities/bill.entity';
import { Complaint } from 'src/modules/complaints/entities/complaint.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Package } from 'src/modules/packages/entities/package.entity';
import { Transaction } from 'src/modules/transactions/entities/transactions.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Company {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  ownerName: string;

  @Field()
  @Column()
  cnic: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => User, (user) => user.company)
  @Field(() => [User])
  users: User[];

  @OneToMany(() => Customer, (customer) => customer.company)
  @Field(() => [Customer])
  customers: Customer[];

  @OneToMany(() => Complaint, (complaint) => complaint.company)
  @Field(() => [Complaint])
  complaints: Complaint[];

  @OneToMany(() => Package, (packageCompany) => packageCompany.company)
  @Field(() => [Package])
  packages: Package[];

  @OneToMany(() => Bill, (bill) => bill.company)
  @Field(() => [Bill])
  bills: Bill[];

  @OneToMany(() => Transaction, (transaction) => transaction.company)
  @Field(() => [Transaction])
  transactions: Transaction[];
}

@ObjectType()
export class CompanyResult {
  @Field(() => [Company])
  data: Company[];

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}

@ObjectType()
export class DeleteCompany {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

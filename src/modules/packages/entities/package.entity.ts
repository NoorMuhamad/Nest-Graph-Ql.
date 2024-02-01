import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/index';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Package {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  monthlyFee: number;

  @Field()
  @Column()
  speed: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false, nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToMany(() => Customer, (customer) => customer.packages)
  @Field(() => [Customer])
  customers: Customer[];
}

@ObjectType()
export class PackageResponse extends PaginatedResponse {
  @Field(() => [Package])
  data: Package[];
}

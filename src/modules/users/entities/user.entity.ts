import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from 'src/enums';
import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Register the enum in GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class User {
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

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Company)
  @JoinColumn()
  @Field(() => Company)
  company: Company;
}

@ObjectType()
export class UserResult {
  @Field(() => [User])
  data: User[];

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}

@ObjectType()
export class DeleteUser {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from 'src/enums';

// Register the enum in GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  username: string;

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
}

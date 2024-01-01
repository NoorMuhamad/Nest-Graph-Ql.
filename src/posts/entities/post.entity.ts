import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @ManyToOne(() => Author)
  @JoinColumn()
  @Field(() => Author)
  author: Author;
}

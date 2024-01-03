import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import typeOrmConfig from './config/database.config';
import { AuthorsModule } from './modules/authors/authors.module';
import { PostsModule } from './modules/posts/posts.module';

console.log(process.env);
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    AuthorsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

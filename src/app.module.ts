import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { AuthorsModule } from './authors/authors.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostsModule,
    AuthorsModule,
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'tutors',
    //   entities: ['dist/**/*.entity.{ts,js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bsrwbcosoti9mfxhvpyp-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'u0eoklpddedc6aib',
      password: 'yQuATz14a5yOqPAt9QBS',
      database: 'bsrwbcosoti9mfxhvpyp',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

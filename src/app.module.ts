import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PetsModule } from './pets/pets.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
    }),
    UsersModule,
    PetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import typeOrmConfig from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { BillsModule } from './modules/bills/bills.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PackagesModule } from './modules/packages/packages.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    BillsModule,
    CustomersModule,
    CompaniesModule,
    ComplaintsModule,
    TransactionsModule,
    PackagesModule,
    AuthModule,
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

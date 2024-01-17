import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction } from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsResolver, TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

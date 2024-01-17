import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsService } from './bills.service';
import { Bill } from './entities/bill.entity';
import { BillsResolver } from './bills.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  providers: [BillsResolver, BillsService],
  exports: [BillsService],
})
export class BillsModule {}

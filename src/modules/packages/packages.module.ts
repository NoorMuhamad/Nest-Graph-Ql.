import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackagesService } from './packages.service';
import { PackagesResolver } from './pacakages.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackagesResolver, PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}

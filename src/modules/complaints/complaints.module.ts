import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { Complaint } from './entities/complaint.entity';
import { ComplaintsResolver } from './complaints.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint])],
  providers: [ComplaintsResolver, ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}

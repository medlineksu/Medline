import { Module } from '@nestjs/common';
import { MedicinePostResolver } from './medicine_post.resolver';
import { MedicinePostService } from './medicine_post.service';

@Module({
  providers: [MedicinePostService, MedicinePostResolver],
})
export class MedicinePostModule {}

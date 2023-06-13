import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import { ParkingRepository } from 'src/modules/parking/repositories/parking.repository';
import { PARKING_REPOSITORY } from 'src/modules/parking/repositories/parking.repository.interface';
import { ParkingService } from 'src/modules/parking/services/parking.service';
import { PARKING_SERVICE } from 'src/modules/parking/services/parking.service.interface';
import { HttpModule } from '@nestjs/axios';
import { ParkingDetailCacheProxy } from 'src/modules/parking/services/parking_detail_cache.proxy';
import { PARKING_DETAIL_SERVICE } from 'src/modules/parking/services/parking_detail.service.inteface';
import { ParkingDetailService } from 'src/modules/parking/services/parking_detail.service';
import { ParkingController } from 'src/modules/parking/controllers/parking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingEntity]), HttpModule],
  providers: [
    {
      useClass: ParkingRepository,
      provide: PARKING_REPOSITORY,
    },
    {
      useClass: ParkingService,
      provide: PARKING_SERVICE,
    },
    {
      useClass: ParkingDetailCacheProxy,
      provide: PARKING_DETAIL_SERVICE,
    },
    ParkingDetailService,
  ],
  controllers: [ParkingController],
  exports: [PARKING_DETAIL_SERVICE],
})
export class ParkingModule {}

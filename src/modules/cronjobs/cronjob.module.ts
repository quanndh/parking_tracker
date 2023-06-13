import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ParkingLotService } from 'src/modules/cronjobs/services/parking_lot.service';
import { ParkingModule } from 'src/modules/parking/parking.module';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, ParkingModule],
  providers: [ParkingLotService],
})
export class CronJobModule {}

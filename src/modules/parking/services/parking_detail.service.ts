import { Inject, Injectable } from '@nestjs/common';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import {
  IParkingService,
  PARKING_SERVICE,
} from 'src/modules/parking/services/parking.service.interface';
import { IParkingDetailService } from 'src/modules/parking/services/parking_detail.service.inteface';

@Injectable()
export class ParkingDetailService implements IParkingDetailService {
  constructor(
    @Inject(PARKING_SERVICE) private readonly parkingService: IParkingService,
  ) {}

  getDetail(code: string): Promise<ParkingEntity> {
    return this.parkingService.findOne({ where: { code } });
  }
}

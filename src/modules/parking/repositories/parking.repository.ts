import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from 'src/modules/common/repositories/common.repository';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import { IParkingRepository } from 'src/modules/parking/repositories/parking.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingRepository
  extends CommonRepository<ParkingEntity>
  implements IParkingRepository
{
  constructor(
    @InjectRepository(ParkingEntity) parkingRepo: Repository<ParkingEntity>,
  ) {
    super(parkingRepo);
  }
}

import { ICommonRepository } from 'src/modules/common/repositories/common.repository.interface';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';

export const PARKING_REPOSITORY = 'PARKING_REPOSITORY';

export type IParkingRepository = ICommonRepository<ParkingEntity>;

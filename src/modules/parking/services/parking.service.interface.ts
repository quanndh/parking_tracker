import { Pagination } from 'src/modules/common/interfaces';
import { ICommonService } from 'src/modules/common/services/common.service.interface';
import { NearestParkingArgs } from 'src/modules/parking/dtos/parking.args';
import { ParkingWithLots } from 'src/modules/parking/dtos/parking.dtos';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';

export const PARKING_SERVICE = 'PARKING_SERVICE';

export interface IParkingService extends ICommonService<ParkingEntity> {
  initData(): Promise<void>;
  nearest(query: NearestParkingArgs): Promise<Pagination<ParkingWithLots>>;
}

import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';

export const PARKING_DETAIL_SERVICE = 'PARKING_DETAIL_SERVICE';

export interface IParkingDetailService {
  getDetail(code: string): Promise<ParkingEntity>;
}

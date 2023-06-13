import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';

export type ParkingWithLots = ParkingEntity & {
  totalLots: number;
  availableLots: number;
};

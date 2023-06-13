import { BasePaginationArgs } from 'src/modules/common/dtos/args';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class NearestParkingArgs extends BasePaginationArgs {
  @IsNotEmpty({ message: 'Latitude is required' })
  latitude: number;

  @IsNotEmpty({ message: 'Longitude is required' })
  longitude: number;
}

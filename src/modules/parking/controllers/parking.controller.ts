import { Controller, Get, Inject, Query } from '@nestjs/common';
import { NearestParkingArgs } from 'src/modules/parking/dtos/parking.args';
import {
  IParkingService,
  PARKING_SERVICE,
} from 'src/modules/parking/services/parking.service.interface';

@Controller('/carparks')
export class ParkingController {
  constructor(
    @Inject(PARKING_SERVICE) private readonly parkingService: IParkingService,
  ) {}

  @Get('/nearest')
  nearest(@Query() query: NearestParkingArgs) {
    return this.parkingService.nearest(query);
  }
}

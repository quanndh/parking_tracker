import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CacheService } from 'src/modules/cache/services/cache.service';
import { CacheKey } from 'src/modules/cache/utils/cache_key';
import {
  IParkingDetailService,
  PARKING_DETAIL_SERVICE,
} from 'src/modules/parking/services/parking_detail.service.inteface';

@Injectable()
export class ParkingLotService implements OnModuleInit {
  private logger = new Logger(ParkingLotService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(PARKING_DETAIL_SERVICE)
    private readonly parkingDetailService: IParkingDetailService,
    private readonly cacheService: CacheService,
  ) {}

  onModuleInit() {
    this.syncParkingLot();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncParkingLot() {
    this.logger.debug('Start sync parking lot');

    await Promise.all([
      this.cacheService.del(CacheKey.parkingSet),
      this.cacheService.del(CacheKey.parkingLots('*')),
    ]);

    const { data } = await firstValueFrom(
      this.httpService
        .get('https://api.data.gov.sg/v1/transport/carpark-availability')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const parkingData = data.items[0].carpark_data;

    const availableParkings = parkingData
      .map((parking) => {
        let totalLots = 0;
        let availableLots = 0;

        parking.carpark_info.forEach((parkingInfo) => {
          totalLots += Number(parkingInfo.total_lots);
          availableLots += Number(parkingInfo.lots_available);
        });

        return {
          code: parking.carpark_number,
          totalLots,
          availableLots,
        };
      })
      .filter((parking) => parking.availableLots > 0);

    await Promise.all(
      availableParkings.map((parking) => this.saveParkingData(parking)),
    );
    this.logger.debug('Parking lot synced');
  }

  saveParkingData = async (parking) => {
    const { code, totalLots, availableLots } = parking;
    const parkingDetail = await this.parkingDetailService.getDetail(code);

    if (parkingDetail) {
      const [lat, long] = parkingDetail.coordinates.coordinates;
      await Promise.all([
        this.cacheService.geoAdd(CacheKey.parkingSet, long, lat, code),
        this.cacheService.set(CacheKey.parkingLots(code), {
          ...parkingDetail,
          totalLots,
          availableLots,
        }),
      ]);
    }
  };
}

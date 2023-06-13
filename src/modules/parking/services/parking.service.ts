import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CommonService } from 'src/modules/common/services/common.service';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import {
  IParkingRepository,
  PARKING_REPOSITORY,
} from 'src/modules/parking/repositories/parking.repository.interface';
import { IParkingService } from 'src/modules/parking/services/parking.service.interface';
import * as proj4 from 'proj4';
import { NearestParkingArgs } from 'src/modules/parking/dtos/parking.args';
import { CacheService } from 'src/modules/cache/services/cache.service';
import { CacheKey } from 'src/modules/cache/utils/cache_key';
import { ParkingWithLots } from 'src/modules/parking/dtos/parking.dtos';
import { createPaginationObject } from 'src/helpers/resolve-pagination';
import { Pagination } from 'src/modules/common/interfaces';

@Injectable()
export class ParkingService
  extends CommonService<ParkingEntity>
  implements IParkingService, OnModuleInit
{
  private readonly logger = new Logger(ParkingService.name);

  constructor(
    @Inject(PARKING_REPOSITORY)
    private readonly parkingRepo: IParkingRepository,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {
    super(parkingRepo);
  }

  onModuleInit() {
    return this.initData();
  }

  initData = async (): Promise<void> => {
    const hasData = await this.count({});
    if (hasData) return;

    const { data } = await firstValueFrom(
      this.httpService
        .get(
          'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000',
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const parkings = data.result.records;

    proj4.defs(
      'EPSG:3414',
      '+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
    );

    await Promise.all(
      parkings.map((x) => {
        const [long, lat] = proj4('EPSG:3414').inverse([
          Number(x.x_coord),
          Number(x.y_coord),
        ]);

        const values = {
          code: x.car_park_no,
          address: x.address,
          parkingType: x.car_park_type,
          parkingSystem: x.type_of_parking_system,
          shortTermParking: x.short_term_parking,
          freeParking: x.free_parking,
          nightParking: x.night_parking === 'YES',
          parkingDeck: x.car_park_decks,
          gantryHeight: x.gantry_height,
          hasBasement: x.car_park_basement === 'Y',
        };

        return this.parkingRepo
          .createQueryBuilder()
          .insert()
          .into(ParkingEntity)
          .values({
            ...values,
            coordinates: () =>
              `ST_GeomFromGeoJSON( '{ "type": "Point", "coordinates": [${lat}, ${long}] }' )`,
          })
          .execute();
      }),
    );
  };

  async nearest({
    limit = 10,
    page = 1,
    latitude,
    longitude,
  }: NearestParkingArgs): Promise<Pagination<ParkingWithLots>> {
    try {
      const [nearestParkingCodes, total] = await Promise.all([
        this.cacheService.geoSearch(
          CacheKey.parkingSet,
          longitude,
          latitude,
          limit * page,
        ),
        this.cacheService.count(CacheKey.parkingLots('*')),
      ]);
      const nearestParkingCodesSlide = nearestParkingCodes.splice(
        (page - 1) * limit,
      );
      const nearestParkings: ParkingWithLots[] = [];

      for await (const code of nearestParkingCodesSlide) {
        const parkingLot = await this.cacheService.get<ParkingWithLots>(
          CacheKey.parkingLots(String(code)),
        );
        if (parkingLot) {
          nearestParkings.push(parkingLot);
        }
      }

      return createPaginationObject(nearestParkings, total, page, limit);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from 'src/modules/cache/services/cache.service';
import { CacheKey } from 'src/modules/cache/utils/cache_key';
import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import { ParkingDetailService } from 'src/modules/parking/services/parking_detail.service';
import { IParkingDetailService } from 'src/modules/parking/services/parking_detail.service.inteface';

@Injectable()
export class ParkingDetailCacheProxy implements IParkingDetailService {
  constructor(
    private readonly parkingDetailService: ParkingDetailService,
    private readonly cacheService: CacheService,
  ) {}

  async getDetail(code: string): Promise<ParkingEntity> {
    let parking = await this.cacheService.get<ParkingEntity>(
      CacheKey.parkingDetail(code),
    );

    if (parking) return parking;

    parking = await this.parkingDetailService.getDetail(code);
    await this.cacheService.set(CacheKey.parkingDetail(code), parking);
    return parking;
  }
}

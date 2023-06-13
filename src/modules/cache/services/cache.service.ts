import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  async count<T>(key: string): Promise<number> {
    try {
      const data = await this.redis.keys(key);
      if (!data) return 0;
      return data.length;
    } catch (error) {
      throw error;
    }
  }

  async geoAdd(geoSet: string, long: number, lat: number, id: string) {
    try {
      const data = await this.redis.geoadd(geoSet, long, lat, id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async geoSearch(geoSet: string, long: number, lat: number, limit = 5) {
    try {
      const data = await this.redis.geosearch(
        geoSet,
        'FROMLONLAT',
        long,
        lat,
        'BYRADIUS',
        20000,
        'km',
        'ASC',
        'count',
        limit,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async incr(key: string) {
    try {
      const data = await this.redis.incr(key);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async set<T>(key: string, payload: T) {
    try {
      await this.redis.set(key, JSON.stringify(payload));
    } catch (error) {
      throw error;
    }
  }

  async del(key: any) {
    try {
      await this.redis.del(key);
    } catch (error) {
      throw error;
    }
  }

  async delWithPattern(pattern: string) {
    try {
      const stream = this.redis.scanStream({
        match: pattern,
      });
      stream.on('data', (keys) => {
        if (keys.length) {
          const pipeline = this.redis.pipeline();
          keys.forEach(function (key) {
            pipeline.del(key);
          });
          pipeline.exec();
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/modules/cache/services/cache.service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

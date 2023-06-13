import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/configs/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/modules/common/common.module';
import { AppController } from 'src/app.controller';
import { CacheModule } from 'src/modules/cache/cache.module';
import { CronJobModule } from 'src/modules/cronjobs/cronjob.module';
import { ParkingModule } from 'src/modules/parking/parking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      expandVariables: true,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    CommonModule,
    CacheModule,
    CronJobModule,
    ParkingModule,
  ],

  controllers: [AppController],
  providers: [],
})
export class AppModule {}

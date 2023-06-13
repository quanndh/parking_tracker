import { ParkingEntity } from 'src/modules/parking/entities/parking.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default () => {
  return {
    port: Number(process.env.PORT) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: process.env.DATABASE_SYNC === 'true',
      connectTimeoutMS: 10000,
      maxQueryExecutionTime: 5000,
      logging: process.env.DATABASE_LOGGING === 'true',
      type: 'postgres',
      entities: [ParkingEntity],
      logNotifications: true,
      namingStrategy: new SnakeNamingStrategy(),
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 86400,
      password: process.env.REDIS_PASSWORD,
    },
  };
};

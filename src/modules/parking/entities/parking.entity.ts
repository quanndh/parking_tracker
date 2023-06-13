import { UUIDEntity } from 'src/modules/common/entities/base-entity';
import { Column, Entity, Index, Point } from 'typeorm';

@Entity({
  name: 'parkings',
})
@Index(['code'], { unique: true, where: '"deleted_at" IS NULL' })
export class ParkingEntity extends UUIDEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  address: string;

  @Column({
    type: 'geometry',
    srid: 4326,
    spatialFeatureType: 'Point',
  })
  coordinates: Point;

  @Column()
  parkingType: string;

  @Column()
  parkingSystem: string;

  @Column()
  shortTermParking: string;

  @Column()
  freeParking: string;

  @Column()
  nightParking: boolean;

  @Column()
  parkingDeck: number;

  @Column({ type: 'float8' })
  gantryHeight: number;

  @Column()
  hasBasement: boolean;
}

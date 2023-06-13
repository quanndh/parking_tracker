import { UUIDEntity } from 'src/modules/common/entities/base-entity';
import { ICommonRepository } from 'src/modules/common/repositories/common.repository.interface';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export const COMMON_SERVICE = 'COMMON_SERVICE';

export interface ICommonService<T extends UUIDEntity> {
  newInstance(data: DeepPartial<T>): T;
  save(
    entity: DeepPartial<T>,
    options?: SaveOptions,
  ): Promise<DeepPartial<T> & T>;
  saveMany(
    entity: DeepPartial<T>[],
    options?: SaveOptions,
  ): Promise<(DeepPartial<T> & T)[]>;
  create(data: DeepPartial<T>): Promise<T>;
  findAll(options: FindManyOptions<T>): Promise<T[]>;
  count(options: FindManyOptions<T>): Promise<number>;
  findAndCount(options: FindManyOptions<T>): Promise<[T[], number]>;
  findOne(options: FindOneOptions<T>): Promise<T | undefined>;
  update(id: string, data: QueryDeepPartialEntity<T>): Promise<T | undefined>;
  getRepository(): ICommonRepository<T>;
}

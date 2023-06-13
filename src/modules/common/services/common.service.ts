import { Injectable } from '@nestjs/common';
import { UUIDEntity } from 'src/modules/common/entities/base-entity';
import { ICommonRepository } from 'src/modules/common/repositories/common.repository.interface';
import { ICommonService } from 'src/modules/common/services/common.service.interface';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CommonService<T extends UUIDEntity> implements ICommonService<T> {
  private repository: ICommonRepository<T>;

  constructor(repo: ICommonRepository<T>) {
    this.repository = repo;
  }

  newInstance = (data: DeepPartial<T>) => {
    return this.repository.create(data);
  };

  save = (entity: DeepPartial<T>, options?: SaveOptions | undefined) => {
    return this.repository.save(entity, options);
  };

  saveMany = (entity: DeepPartial<T>[], options?: SaveOptions | undefined) => {
    return this.repository.save(entity, options);
  };
  create = async (data: DeepPartial<T>) => {
    const instance = this.repository.create(data);
    await this.repository.save(instance as DeepPartial<T>);

    return instance;
  };

  findAll = (options: FindManyOptions<T>) => {
    return this.repository.find(options);
  };

  count = (options: FindManyOptions<T>) => {
    return this.repository.count(options);
  };

  findAndCount = (options: FindManyOptions<T>) => {
    return this.repository.findAndCount(options);
  };

  findOne = (options: FindOneOptions<T>) => {
    return this.repository.findOne(options);
  };

  update = async (id: string, data: QueryDeepPartialEntity<T>) => {
    try {
      await this.repository.update(id, { ...data });

      return await this.findOne({ where: { id } as FindOptionsWhere<T> });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  delete = async (id: string) => {
    try {
      await this.repository.softDelete(id);
      return id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  getRepository = () => this.repository;
}

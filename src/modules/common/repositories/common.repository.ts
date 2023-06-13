import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createPaginationObject,
  resolveOptions,
} from 'src/helpers/resolve-pagination';
import { PaginationArgs } from 'src/modules/common/dtos/args';
import { ICommonRepository } from 'src/modules/common/repositories/common.repository.interface';
import { Pagination } from 'src/modules/common/interfaces';
import {
  EntitySchema,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class CommonRepository<Model extends ObjectLiteral>
  extends Repository<Model>
  implements ICommonRepository<Model>
{
  constructor(
    @InjectRepository(EntitySchema<Model>)
    private readonly repository: Repository<Model>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async paginate(
    data: PaginationArgs,
    searchOptions?: FindManyOptions<Model>,
    cb?: (val: FindManyOptions<Model>) => FindManyOptions<Model>,
  ): Promise<Pagination<Model>> {
    const { page, limit, query } = resolveOptions(data);

    let where = {};
    if (searchOptions && searchOptions.where) {
      where = searchOptions.where;
    }
    where = { ...where, ...query };
    const options = cb
      ? cb({ ...searchOptions, where })
      : { ...searchOptions, where };

    const [items, total] = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...options,
    });
    return createPaginationObject<Model>(items, total, page, limit);
  }
}

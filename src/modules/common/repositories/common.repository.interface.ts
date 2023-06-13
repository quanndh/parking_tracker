import { PaginationArgs } from 'src/modules/common/dtos/args';
import { Pagination } from 'src/modules/common/interfaces';
import { FindManyOptions, Repository } from 'typeorm';

export const COMMON_REPOSITORY = 'COMMON_REPOSITORY';

export interface ICommonRepository<Model> extends Repository<Model> {
  paginate(
    data: PaginationArgs,
    searchOptions?: FindManyOptions<Model>,
    cb?: (val: FindManyOptions<Model>) => FindManyOptions<Model>,
  ): Promise<Pagination<Model>>;
}

import {
  Like,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  Between,
} from 'typeorm';
import { PaginationArgs } from 'src/modules/common/dtos/args';
import { FilterInput } from 'src/modules/common/dtos/input';

export function resolveOptions(options: PaginationArgs) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 15;
  const offset = (page - 1) * limit;
  const query = generateQueryByFilter(options.filters);

  return { page, limit, query, offset };
}
const generateQueryByFilter = (filters?: FilterInput[]) => {
  const where: Record<string, any> = {};
  filters?.forEach((filter) => {
    switch (filter.operator) {
      case 'EQ':
        where[filter.field] = Equal(filter.value);
        break;
      case 'CONTAINS':
        where[filter.field] = Like(`%${filter.value}%`);
        break;
      case 'NE':
        where[filter.field] = Not(filter.value);
        break;
      case 'GREATERTHAN':
        where[filter.field] = MoreThan(filter.value);
        break;
      case 'GREATERTHAN_EQ':
        where[filter.field] = MoreThanOrEqual(filter.value);
        break;
      case 'LESSTHAN':
        where[filter.field] = LessThan(filter.value);
        break;
      case 'LESSTHAN_EQ':
        where[filter.field] = LessThanOrEqual(filter.value);
        break;
      case 'BETWEEN': {
        const vals = filter.value.split(':');
        if (vals.length === 2) {
          where[filter.field] = Between(vals[0], vals[1]);
        }
        break;
      }
      default:
        break;
    }
  });
  return where;
};

export function createPaginationObject<T>(
  items: T[],
  totalItems: number,
  currentPage: number,
  limit: number,
) {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: currentPage,
    },
  };
}

export class BasePaginationArgs {
  limit?: number;

  page?: number;
}

export class PaginationArgs extends BasePaginationArgs {
  filters?: any[];

  s?: string;
}

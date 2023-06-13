export interface IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta, // public readonly links: IPaginationLinks,
  ) /**
   * associated links
   */ {}
}

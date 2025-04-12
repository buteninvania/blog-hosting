export interface GetBlogsQueryParamsModel {
  pageNumber: number;
  pageSize: number;
  searchNameTerm: null | string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface GetUsersQueryParamsModel {
  pageNumber: number;
  pageSize: number;
  searchEmailTerm: null | string;
  searchLoginTerm: null | string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

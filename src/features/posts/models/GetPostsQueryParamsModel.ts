export interface GetPostsQueryParamsModel {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface PaginatedUsersViewModel {
  items: UsersViewModel[];
  page: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
}

export interface UsersViewModel {
  createdAt: string;
  email: string;
  id: string;
  login: string;
}

export interface PaginatedUsersViewModel {
  items: UserDbType[];
  page: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
}

export interface UserDbType {
  createdAt: string;
  email: string;
  id: string;
  login: string;
  password: string;
}

export interface UserViewModel {
  createdAt: string;
  email: string;
  id: string;
  login: string;
}

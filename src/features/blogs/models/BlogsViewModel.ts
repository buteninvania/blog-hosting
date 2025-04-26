export interface BlogsViewModel {
  createdAt: string;
  description: string;
  id: string;
  isMembership: boolean;
  name: string;
  websiteUrl: string;
}

export interface PaginatedBlogsViewModel {
  items: BlogsViewModel[];
  page: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
}

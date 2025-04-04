export interface PaginatedPostsViewModel {
  items: PostDbType[];
  page: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
}

export interface PostDbType {
  blogId: string;
  blogName: string;
  content: string;
  createdAt: string;
  id: string;
  shortDescription: string;
  title: string;
}

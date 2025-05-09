import { GetBlogsQueryParamsModel } from "./features/blogs/models/GetBlogsQueryParamsModel";
import { GetPostsQueryParamsModel } from "./features/posts/models/GetPostsQueryParamsModel";
import { GetUsersQueryParamsModel, UsersQueryParamsModel } from "./features/users/models/GetUsersQueryParamsModel";

export const createQueryParamsForBlogs = (query: GetBlogsQueryParamsModel): GetBlogsQueryParamsModel => {
  const { pageNumber = 1, pageSize = 10, searchNameTerm, sortBy = "createdAt", sortDirection = "desc" } = query;

  const queryParams: GetBlogsQueryParamsModel = {
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    searchNameTerm: searchNameTerm,
    sortBy: sortBy,
    sortDirection: sortDirection,
  };

  if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
    queryParams.sortDirection = "desc";
  }
  return queryParams;
};

export const createQueryParamsForPosts = (query: GetPostsQueryParamsModel): GetPostsQueryParamsModel => {
  const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = query;

  const queryParams: GetPostsQueryParamsModel = {
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    sortBy: sortBy,
    sortDirection: sortDirection,
  };

  if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
    queryParams.sortDirection = "desc";
  }

  return queryParams;
};

export const createQueryParamsForUsers = (query: GetUsersQueryParamsModel): UsersQueryParamsModel => {
  const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = query;

  const searchEmailTerm = query.searchEmailTerm ?? null;
  const searchLoginTerm = query.searchLoginTerm ?? null;

  const queryParams: UsersQueryParamsModel = {
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    searchEmailTerm,
    searchLoginTerm,
    sortBy: sortBy,
    sortDirection: sortDirection,
  };

  if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
    queryParams.sortDirection = "desc";
  }

  return queryParams;
};

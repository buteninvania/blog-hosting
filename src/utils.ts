import { GetUsersQueryParamsModel } from "@/features/users/models/GetUsersQueryParamsModel";

import { GetBlogsQueryParamsModel } from "./features/blogs/models/GetBlogsQueryParamsModel";
import { GetPostsQueryParamsModel } from "./features/posts/models/GetPostsQueryParamsModel";

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

export const createQueryParamsForUsers = (query: GetUsersQueryParamsModel): GetUsersQueryParamsModel => {
  const { pageNumber = 1, pageSize = 10, searchEmailTerm = null, searchLoginTerm = null, sortBy = "createdAt", sortDirection = "desc" } = query;

  const queryParams: GetUsersQueryParamsModel = {
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

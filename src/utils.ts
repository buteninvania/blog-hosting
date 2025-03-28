import { GetBlogsQueryParamsModel } from "./features/blogs/models/GetBlogsQueryParamsModel";
import { GetPostsQueryParamsModel } from "./features/posts/models/GetPostsQueryParamsModel";

export const createQueryParamsForBlogs = (query: GetBlogsQueryParamsModel): GetBlogsQueryParamsModel => {
    const {
        searchNameTerm,
        sortBy = "createdAt",
        sortDirection = "desc",
        pageNumber = 1,
        pageSize = 10,
    } = query;

    const queryParams: GetBlogsQueryParamsModel = {
        searchNameTerm: searchNameTerm as string | null,
        sortBy: sortBy as string,
        sortDirection: sortDirection as "asc" | "desc",
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
    };

    if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
        queryParams.sortDirection = "desc";
    }
    return queryParams
};

export const createQueryParamsForPosts = (query: GetPostsQueryParamsModel): GetPostsQueryParamsModel => {
    const {
        pageNumber = 1,
        sortBy = "createdAt",
        sortDirection = "desc",
        pageSize = 10,
    } = query;

    const queryParams: GetPostsQueryParamsModel = {
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        sortBy: sortBy as string,
        sortDirection: sortDirection as "asc" | "desc",
    };

    if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
        queryParams.sortDirection = "desc";
    }

    return queryParams
}

import { GetBlogsQueryParamsModel } from "./features/blogs/models/GetBlogsQueryParamsModel";

export const createQueryParams = (query: GetBlogsQueryParamsModel): GetBlogsQueryParamsModel => {
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

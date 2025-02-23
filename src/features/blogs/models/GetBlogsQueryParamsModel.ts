export type GetBlogsQueryParamsModel = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

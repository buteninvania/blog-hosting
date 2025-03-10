export type BlogsViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PaginatedBlogsViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogsViewModel[]
}

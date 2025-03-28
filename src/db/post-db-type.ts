export type PaginatedPostsViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostDbType[]
}

export type PostDbType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string,
    createdAt: string
}

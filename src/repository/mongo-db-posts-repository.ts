import {PostsCreateModel} from "../features/posts/models/PostsCreateModel";
import {PaginatedPostsViewModel, PostDbType} from "../db/post-db-type";
import {blogsRepository} from "./mongo-db-blogs-repository";
import {blogCollection, postCollection} from "../db/mongo-db";
import {GetPostsQueryParamsModel} from "../features/posts/models/GetPostsQueryParamsModel";

export const postsRepository = {
    async create(post: PostsCreateModel): Promise<string> {
        const blogData = await blogsRepository.get(post.blogId)
        const blogName = blogData?.name
        if (!blogName) return ''
        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            blogName,
            createdAt: new Date().toISOString(),
            ...post
        }
        await postCollection.insertOne(newPost);
        return newPost.id;
    },
    async getAll(params: GetPostsQueryParamsModel): Promise<PaginatedPostsViewModel> {
        const {
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        } = params;

        const query = postCollection.find();

        if (sortBy) {
            query.sort(`${sortBy} ${sortDirection}`);
        }

        const totalCount = await query.count();

        const skip = (pageNumber - 1) * pageSize;
        query.skip(skip).limit(pageSize);

        const result = await query.toArray();

        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: result.map((post) => this.map(post))
        }
    },
    async get(id: string): Promise<PostDbType | null> {
        const post = await postCollection.findOne({id})
        if (!post) return null
        return this.map(post);
    },
    async getPostsByBlogId(blogId: string, params: GetPostsQueryParamsModel): Promise<PaginatedPostsViewModel> {
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = params;

        const sortOptions: Record<string, 1 | -1> = {};
        if (sortBy) {
            sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        }

        const query = postCollection.find({ blogId }).sort(sortOptions);

        const totalCount = await postCollection.countDocuments({ blogId });

        const skip = (pageNumber - 1) * pageSize;
        const result = await query.skip(skip).limit(pageSize).toArray();

        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: result.map((post) => this.map(post))
        };
    },
    async put(id: string, post: PostsCreateModel): Promise<boolean> {
        if (!id) return false
        const foundPost = await this.get(id)
        if (!foundPost) return false
        await postCollection.updateOne({id}, {$set: post})
        return true
    },
    async delete(id: string): Promise<boolean> {
        if (!id) return false
        const foundPost = await this.get(id)
        if (!foundPost) return false
        await postCollection.deleteOne({id})
        return true
    },
    async deleteAll(): Promise<boolean> {
        await postCollection.deleteMany({})
        return true
    },
    map(post: PostDbType): PostDbType {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}

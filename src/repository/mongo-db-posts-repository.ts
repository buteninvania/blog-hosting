import {PostsCreateModel} from "../features/posts/models/PostsCreateModel";
import {PostDbType} from "../db/post-db-type";
import {blogsRepository} from "./mongo-db-blogs-repository";
import {postCollection} from "../db/mongo-db";

export const postsRepository = {
    async create(post: PostsCreateModel): Promise<string> {
        const blogData = await blogsRepository.get(post.blogId)
        const blogName = blogData?.name
        if (!blogName) return ''
        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            blogName,
            ...post
        }
        await postCollection.insertOne(newPost);
        return newPost.id;
    },
    async getAll(): Promise<PostDbType[]> {
        const result = await postCollection.find().toArray()
        return result.map((post) => this.map(post))
    },
    async get(id: string): Promise<PostDbType | null> {
        const post = await postCollection.findOne({id})
        if (!post) return null
        return this.map(post);
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
            blogName: post.blogName
        }
    }
}

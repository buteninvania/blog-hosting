import { BlogDbType } from "../db/blog-db-type";
import { blogCollection } from "../db/mongo-db";
import { BlogsCreateModel } from "../features/blogs/models/BlogsCreateModel";
import { BlogsViewModel } from "../features/blogs/models/BlogsViewModel";
import { WithId } from "mongodb";

export const blogsRepository = {
    async getAll(): Promise<BlogsViewModel[] | [] | undefined> {
        const result = await blogCollection.find().toArray()
        return result.map((blog) => this.map(blog))
    },
    async create(blog: BlogsCreateModel): Promise<string> {
        const newBlog: BlogDbType = {
            id: String(Date.now() + Math.random()),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }
        await blogCollection.insertOne(newBlog);
        return newBlog.id;
    },
    async get(id: string): Promise<BlogsViewModel | null> {
        const blog = await blogCollection.findOne({id})
        if (!blog) return null
        return this.map(blog);
    },
    async put(id: string, blogData: BlogsCreateModel): Promise<boolean> {
        if (!id) return false
        const foundBlog = await this.get(id)
        if (!foundBlog) return false
        await blogCollection.updateOne({id}, {$set: blogData})
        return true
    },
    async delete(id: string): Promise<boolean> {
        if (!id) return false
        const foundBlog = await this.get(id)
        if (!foundBlog) return false
        await blogCollection.deleteOne({id})
        return true;
    },
    async deleteAll(): Promise<boolean> {
        await blogCollection.deleteMany({})
        return true;
    },
    map(blog: WithId<BlogDbType>): BlogsViewModel {
        return {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}

import { BlogDbType } from "../db/blog-db-type";
import { blogCollection } from "../db/mongo-db";
import { BlogsCreateModel } from "../features/blogs/models/BlogsCreateModel";
import { BlogsViewModel } from "../features/blogs/models/BlogsViewModel";
import { WithId } from "mongodb";

export const blogsRepository = {
    async getAll(): Promise<BlogsViewModel[] | [] | undefined> {
        const result = await blogCollection<BlogDbType[]>.find().toArray()
        return result.map((blog) => this.map(blog))
    },
    async create(blog: BlogsCreateModel): Promise<string> {
        const newBlog: BlogDbType = {
            id: String(Date.now() + Math.random()),
            ...blog
        }
        await blogCollection.insertOne(newBlog);
        return newBlog.id;
    },
    async get(id: string): Promise<BlogsViewModel> {
        const blog = await blogCollection<BlogDbType>.findOne({id})
        return this.map(blog);
    },
    async delete(id: string): Promise<boolean> {
        if (!id) return false
        const foundBlog = await this.get(id)
        if (!foundBlog) return false
        await blogCollection.deleteOne({id})
        return true;
    },
    map(blog: WithId<BlogDbType>): BlogsViewModel {
        return {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        }
    }
}

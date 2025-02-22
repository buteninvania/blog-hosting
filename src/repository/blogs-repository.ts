import {db} from "../db/db";
import {BlogDbType} from "../db/blog-db-type";
import {BlogsCreateModel} from "../features/blogs/models/BlogsCreateModel";
import {BlogsViewModel} from "../features/blogs/models/BlogsViewModel";

export const blogsRepository = {
    create(blog: BlogsCreateModel): string {
        const newBlog: BlogDbType = {
            id: String(Date.now() + Math.random()),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...blog
        }
        db.blogs = [...db.blogs, newBlog];
        return newBlog.id;
    },
    getAll(): BlogDbType[] {
        return db.blogs;
    },
    get(id: string): BlogDbType | null {
        if (!id) return null
        return db.blogs.find(v => v.id === id) || null;
    },
    put(id: string, blogData: BlogsCreateModel): boolean {
        if (!id) return false
        const foundBlog = db.blogs.find(b => b.id === id)
        if (!foundBlog) return false
        foundBlog.name = blogData.name
        foundBlog.description = blogData.description
        foundBlog.websiteUrl = blogData.websiteUrl
        return true
    },
    delete(id: string): boolean {
        if (!id) return false
        const foundBlog = db.blogs.find(b => b.id === id)
        if (!foundBlog) return false
        db.blogs = db.blogs.filter(b => b.id !== foundBlog.id)
        return true;
    },
    map(blog: BlogDbType): BlogsViewModel {
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

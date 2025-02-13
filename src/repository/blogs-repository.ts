import {db} from "../db/db";
import {BlogDbType} from "../db/blog-db-type";
import {BlogsCreateModel} from "../features/blogs/models/BlogsCreateModel";

export const blogsRepository = {
    getBlogs(): BlogDbType[] {
        return db.blogs;
    },
    getBlogById(id: string): BlogDbType | null {
        if (!id) return null
        return db.blogs.find(v => v.id === id) || null;
    },
    createBlog(name: string, description: string, websiteUrl: string): string {
        const newBlog: BlogDbType = {
            id: String(Date.now() + Math.random()),
            name,
            description,
            websiteUrl
        }
        db.blogs.push(newBlog);
        return newBlog.id;
    },
    updateBlog(id: string, blogData: BlogsCreateModel): null {
        return null
    },
    deleteBlog(id: string): null {
        return null;
    }
}

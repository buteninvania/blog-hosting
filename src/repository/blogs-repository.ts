import { BlogDbType } from "../db/blog-db-type";
import { db } from "../db/db";
import { BlogsCreateModel } from "../features/blogs/models/BlogsCreateModel";
import { BlogsViewModel } from "../features/blogs/models/BlogsViewModel";

export const blogsRepository = {
  create(blog: BlogsCreateModel): string {
    const newBlog: BlogDbType = {
      createdAt: new Date().toISOString(),
      id: String(Date.now() + Math.random()),
      isMembership: false,
      ...blog,
    };
    db.blogs = [...db.blogs, newBlog];
    return newBlog.id;
  },
  delete(id: string): boolean {
    if (!id) return false;
    const foundBlog = db.blogs.find((b) => b.id === id);
    if (!foundBlog) return false;
    db.blogs = db.blogs.filter((b) => b.id !== foundBlog.id);
    return true;
  },
  get(id: string): BlogDbType | null {
    if (!id) return null;
    return db.blogs.find((v) => v.id === id) || null;
  },
  getAll(): BlogDbType[] {
    return db.blogs;
  },
  map(blog: BlogDbType): BlogsViewModel {
    return {
      createdAt: blog.createdAt,
      description: blog.description,
      id: blog.id,
      isMembership: blog.isMembership,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  },
  put(id: string, blogData: BlogsCreateModel): boolean {
    if (!id) return false;
    const foundBlog = db.blogs.find((b) => b.id === id);
    if (!foundBlog) return false;
    foundBlog.name = blogData.name;
    foundBlog.description = blogData.description;
    foundBlog.websiteUrl = blogData.websiteUrl;
    return true;
  },
};

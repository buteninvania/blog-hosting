import { db } from "../db/db";
import { PostDbType } from "../db/post-db-type";
import { PostsCreateModel } from "../features/posts/models/PostsCreateModel";
import { PostsViewModel } from "../features/posts/models/PostsViewModel";
import { blogsRepository } from "./blogs-repository";

export const postsRepository = {
  create(post: PostsCreateModel): string {
    const newPost: PostDbType = {
      blogId: post.blogId,
      blogName: blogsRepository.get(post.blogId)!.name,
      content: post.content,
      createdAt: new Date().toISOString(),
      id: new Date().toISOString() + Math.random(),
      shortDescription: post.shortDescription,
      title: post.title,
    };
    db.posts = [...db.posts, newPost];
    return newPost.id;
  },
  delete(id: string): boolean {
    if (!id) return false;
    const foundPost = db.posts.find((b) => b.id === id);
    if (!foundPost) return false;
    db.posts = db.posts.filter((b) => b.id !== foundPost.id);
    return true;
  },
  get(id: string): null | PostDbType {
    if (!id) return null;
    return db.posts.find((v) => v.id === id) || null;
  },
  getAll(): PostDbType[] {
    return db.posts;
  },
  map(post: PostDbType): PostsViewModel {
    return {
      blogId: post.blogId,
      blogName: post.blogName,
      content: post.content,
      createdAt: post.createdAt,
      id: post.id,
      shortDescription: post.shortDescription,
      title: post.title,
    };
  },
  put(id: string, post: PostsCreateModel): boolean {
    const blog = blogsRepository.get(post.blogId)!;
    if (!blog) return false;
    db.posts = db.posts.map((p) => (p.id === id ? { ...p, ...post, blogName: blog.name } : p));
    return true;
  },
};

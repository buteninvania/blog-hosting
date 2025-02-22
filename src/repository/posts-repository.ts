import {db} from "../db/db";
import {PostDbType} from "../db/post-db-type";
import {PostsCreateModel} from "../features/posts/models/PostsCreateModel";
import {blogsRepository} from "./blogs-repository";
import {PostsViewModel} from "../features/posts/models/PostsViewModel";

export const postsRepository = {
    create(post: PostsCreateModel): string {
        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogsRepository.get(post.blogId)!.name,
            createdAt: new Date().toISOString()
        }
        db.posts = [...db.posts, newPost];
        return newPost.id;
    },
    getAll(): PostDbType[] {
        return db.posts;
    },
    get(id: string): PostDbType | null {
        if (!id) return null
        return db.posts.find(v => v.id === id) || null;
    },
    put(id: string, post: PostsCreateModel): boolean {
        const blog = blogsRepository.get(post.blogId)!
        if(!blog) return false
        db.posts = db.posts.map(p => p.id === id ? {...p, ...post, blogName: blog.name} : p)
        return true
    },
    delete(id: string): boolean {
        if (!id) return false
        const foundPost = db.posts.find(b => b.id === id)
        if (!foundPost) return false
        db.posts = db.posts.filter(b => b.id !== foundPost.id)
        return true
    },
    map(post: PostDbType): PostsViewModel {
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

import {db} from "../db/db";
import {PostDbType} from "../db/post-db-type";
import {PostsCreateModel} from "../features/posts/models/PostsCreateModel";

export const postsRepository = {
    getPosts(): PostDbType[] {
        return db.posts;
    },
    getPostById(id: string): PostDbType | null {
        if (!id) return null
        return db.posts.find(v => v.id === id) || null;
    },
    createPost(postData: PostsCreateModel): string {
        return "";
    },
    updatePost(id: string, postData: PostsCreateModel): null {
        return null
    },
    deletePost(id: string): null {
        return null;
    }
}

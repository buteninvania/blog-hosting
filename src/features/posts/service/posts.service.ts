import {GetPostsQueryParamsModel} from "../models/GetPostsQueryParamsModel";
import {postsRepository} from "../../../repository/mongo-db-posts-repository";
import {PostsCreateModel} from "../models/PostsCreateModel";

export const postServices = {
    getPosts: async (queryParams: GetPostsQueryParamsModel) => {
        return  await postsRepository.getAll(queryParams);
    },
    getPost: async (id: string) => {
        return await postsRepository.get(id);
    },
    createPost: async (postData: PostsCreateModel) => {
        const newPostId = await postsRepository.create(postData);
        return await postsRepository.get(newPostId);
    },
    updatePost: async (id: string, postData: PostsCreateModel) => {
        return await postsRepository.put(id, postData);
    },
    deletePost: async (id: string) => {
        return await postsRepository.delete(id);
    },
    getPostsByBlogId: async (blogId: string, queryParams: GetPostsQueryParamsModel) => {
        return await postsRepository.getPostsByBlogId(blogId, queryParams);
    }
}

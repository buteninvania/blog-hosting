import { postsRepository } from "@/repository/mongo-db-posts-repository";

import { GetPostsQueryParamsModel } from "../models/GetPostsQueryParamsModel";
import { PostsCreateModel } from "../models/PostsCreateModel";

export const postServices = {
  createPost: async (postData: PostsCreateModel) => {
    const newPostId = await postsRepository.create(postData);
    return await postsRepository.get(newPostId);
  },
  deletePost: async (id: string) => {
    return await postsRepository.delete(id);
  },
  getPost: async (id: string) => {
    return await postsRepository.get(id);
  },
  getPosts: async (queryParams: GetPostsQueryParamsModel) => {
    return await postsRepository.getAll(queryParams);
  },
  getPostsByBlogId: async (blogId: string, queryParams: GetPostsQueryParamsModel) => {
    return await postsRepository.getPostsByBlogId(blogId, queryParams);
  },
  updatePost: async (id: string, postData: PostsCreateModel) => {
    return await postsRepository.put(id, postData);
  },
};

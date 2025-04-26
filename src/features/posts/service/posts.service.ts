import { postsRepository } from "../../../repository/mongo-db-posts-repository";
import { GetPostsQueryParamsModel } from "../models/GetPostsQueryParamsModel";
import { PostsCreateModel } from "../models/PostsCreateModel";
import { PostsViewModel } from "../models/PostsViewModel";

export const postServices = {
  createPost: async (postData: PostsCreateModel): Promise<null | PostsViewModel> => {
    const newPostId = await postsRepository.create(postData);
    return postsRepository.get(newPostId);
  },
  deletePost: async (id: string) => {
    return postsRepository.delete(id);
  },
  getPost: async (id: string) => {
    return postsRepository.get(id);
  },
  getPosts: async (queryParams: GetPostsQueryParamsModel) => {
    return postsRepository.getAll(queryParams);
  },
  getPostsByBlogId: async (blogId: string, queryParams: GetPostsQueryParamsModel) => {
    return await postsRepository.getPostsByBlogId(blogId, queryParams);
  },
  updatePost: async (id: string, postData: PostsCreateModel) => {
    return postsRepository.put(id, postData);
  },
};

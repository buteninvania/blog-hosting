import { blogsRepository } from "../../../repository/mongo-db-blogs-repository";
import { BlogsCreateModel } from "../models/BlogsCreateModel";
import { GetBlogsQueryParamsModel } from "../models/GetBlogsQueryParamsModel";

export const blogServices = {
  createBlog: async (blogData: BlogsCreateModel) => {
    const blogId = await blogsRepository.create(blogData);
    return await blogsRepository.get(blogId);
  },
  deleteBlog: async (id: string) => {
    return await blogsRepository.delete(id);
  },
  getBlog: async (id: string) => {
    return await blogsRepository.get(id);
  },
  getBlogs: async (queryParams: GetBlogsQueryParamsModel) => {
    return await blogsRepository.getAll(queryParams);
  },
  updateBlog: async (id: string, blogData: BlogsCreateModel) => {
    return await blogsRepository.put(id, blogData);
  },
};

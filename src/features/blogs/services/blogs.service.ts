import {GetBlogsQueryParamsModel} from "../models/GetBlogsQueryParamsModel";
import {blogsRepository} from "../../../repository/mongo-db-blogs-repository";
import {BlogsCreateModel} from "../models/BlogsCreateModel";

export const blogServices = {
    getBlogs: async (queryParams: GetBlogsQueryParamsModel) => {
        return await blogsRepository.getAll(queryParams);
    },
    getBlog: async (id: string) => {
        return await blogsRepository.get(id);
    },
    createBlog: async (blogData: BlogsCreateModel) => {
        const blogId = await blogsRepository.create(blogData);
        return await blogsRepository.get(blogId);
    },
    updateBlog: async (id: string, blogData: BlogsCreateModel) => {
        return await blogsRepository.put(id, blogData);
    },
    deleteBlog: async (id: string) => {
        return await blogsRepository.delete(id);
    },
}

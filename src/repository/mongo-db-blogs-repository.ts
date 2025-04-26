import { Filter, WithId } from "mongodb";

import { BlogDbType } from "../db/blog-db-type";
import { blogCollection } from "../db/mongo-db";
import { BlogsCreateModel } from "../features/blogs/models/BlogsCreateModel";
import { BlogsViewModel, PaginatedBlogsViewModel } from "../features/blogs/models/BlogsViewModel";
import { GetBlogsQueryParamsModel } from "../features/blogs/models/GetBlogsQueryParamsModel";

export const blogsRepository = {
  async create(blog: BlogsCreateModel): Promise<string> {
    const newBlog: BlogDbType = {
      createdAt: new Date().toISOString(),
      id: String(Date.now() + Math.random()),
      isMembership: false,
      ...blog,
    };
    await blogCollection.insertOne(newBlog);
    return newBlog.id;
  },
  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const foundBlog = await this.get(id);
    if (!foundBlog) return false;
    await blogCollection.deleteOne({ id });
    return true;
  },
  async deleteAll(): Promise<boolean> {
    await blogCollection.deleteMany({});
    return true;
  },
  async get(id: string): Promise<BlogsViewModel | null> {
    const blog = await blogCollection.findOne({ id });
    if (!blog) return null;
    return this.map(blog);
  },
  async getAll(params: GetBlogsQueryParamsModel): Promise<PaginatedBlogsViewModel> {
    const { pageNumber = 1, pageSize = 10, searchNameTerm = "", sortBy = "createdAt", sortDirection = "desc" } = params;

    const filter: Filter<BlogDbType> = {};
    if (searchNameTerm) {
      filter.name = { $options: "i", $regex: searchNameTerm };
    }

    const sortOptions: Record<string, -1 | 1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;
    }

    const totalCount = await blogCollection.countDocuments(filter);
    const items = await blogCollection
      .find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: items.map((blog) => this.map(blog)),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  },
  map(blog: WithId<BlogDbType>): BlogsViewModel {
    return {
      createdAt: blog.createdAt,
      description: blog.description,
      id: blog.id,
      isMembership: blog.isMembership,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  },
  async put(id: string, blogData: BlogsCreateModel): Promise<boolean> {
    if (!id) return false;
    const foundBlog = await this.get(id);
    if (!foundBlog) return false;
    await blogCollection.updateOne({ id }, { $set: blogData });
    return true;
  },
};

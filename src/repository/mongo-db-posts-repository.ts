import { postCollection } from "@/db/mongo-db";
import { PaginatedPostsViewModel, PostDbType } from "@/db/post-db-type";
import { GetPostsQueryParamsModel } from "@/features/posts/models/GetPostsQueryParamsModel";
import { PostsCreateModel } from "@/features/posts/models/PostsCreateModel";

import { blogsRepository } from "./mongo-db-blogs-repository";

export const postsRepository = {
  async create(post: PostsCreateModel): Promise<string> {
    const blogData = await blogsRepository.get(post.blogId);
    const blogName = blogData?.name;
    if (!blogName) return "";
    const newPost: PostDbType = {
      blogName,
      createdAt: new Date().toISOString(),
      id: new Date().toISOString() + Math.random(),
      ...post,
    };
    await postCollection.insertOne(newPost);
    return newPost.id;
  },
  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const foundPost = await this.get(id);
    if (!foundPost) return false;
    await postCollection.deleteOne({ id });
    return true;
  },
  async deleteAll(): Promise<boolean> {
    await postCollection.deleteMany({});
    return true;
  },
  async get(id: string): Promise<null | PostDbType> {
    const post = await postCollection.findOne({ id });
    if (!post) return null;
    return this.map(post);
  },
  async getAll(params: GetPostsQueryParamsModel): Promise<PaginatedPostsViewModel> {
    const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = params;

    const sortOptions: Record<string, -1 | 1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;
    }

    const totalCount = await postCollection.countDocuments();
    const items = await postCollection
      .find()
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: items.map((post) => this.map(post)),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  },
  async getPostsByBlogId(blogId: string, params: GetPostsQueryParamsModel): Promise<PaginatedPostsViewModel> {
    const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = params;

    const sortOptions: Record<string, -1 | 1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;
    }

    const query = postCollection.find({ blogId }).sort(sortOptions);

    const totalCount = await postCollection.countDocuments({ blogId });

    const skip = (pageNumber - 1) * pageSize;
    const result = await query.skip(skip).limit(pageSize).toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: result.map((post) => this.map(post)),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  },
  map(post: PostDbType): PostDbType {
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
  async put(id: string, post: PostsCreateModel): Promise<boolean> {
    if (!id) return false;
    const foundPost = await this.get(id);
    if (!foundPost) return false;
    await postCollection.updateOne({ id }, { $set: post });
    return true;
  },
};

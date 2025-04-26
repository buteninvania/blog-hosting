import { Response, Router } from "express";

import { PaginatedPostsViewModel } from "../../../db/post-db-type";
import { SETTINGS } from "../../../settings";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../../../types";
import { createQueryParamsForBlogs, createQueryParamsForPosts } from "../../../utils";
import { GetPostsQueryParamsModel } from "../../posts/models/GetPostsQueryParamsModel";
import { PostsViewModel } from "../../posts/models/PostsViewModel";
import { postServices } from "../../posts/service/posts.service";
import { OutputErrorsType } from "../../types/output-errors-type";
import { createBlogValidators, createPostByBlogIdValidators, deleteBlogValidators, updateBlogValidators } from "../middleware/blogs.middleware";
import { BlogPostInputModel } from "../models/BlogPostInputModel";
import { BlogsCreateModel } from "../models/BlogsCreateModel";
import { BlogsUpdateModel } from "../models/BlogsUpdateModel";
import { BlogsURIParamsModel } from "../models/BlogsURIParamsModel";
import { BlogsViewModel, PaginatedBlogsViewModel } from "../models/BlogsViewModel";
import { GetBlogsQueryParamsModel } from "../models/GetBlogsQueryParamsModel";
import { GetByBlogIdURIParamsModel } from "../models/GetByBlogIdURIParamsModel";
import { blogServices } from "../services/blogs.service";

export const blogsRouter = Router();

const blogController = {
  createBlogController: async (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>) => {
    const { description, name, websiteUrl } = req.body;
    const newBlog = await blogServices.createBlog({ description, name, websiteUrl });
    if (newBlog) return res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog);
    return res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
  },
  createPostByBlogIdController: async (
    req: RequestWithParamsAndBody<GetByBlogIdURIParamsModel, BlogPostInputModel>,
    res: Response<PostsViewModel>,
  ) => {
    const foundBlog = await blogServices.getBlog(req.params.blogId);
    if (!foundBlog) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    const newPost = await postServices.createPost({ ...req.body, blogId: foundBlog.id });
    return newPost ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost) : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
  },
  deleteBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response) => {
    (await blogServices.deleteBlog(req.params.id))
      ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
      : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  },
  getBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response<BlogsViewModel>) => {
    const foundBlog = await blogServices.getBlog(req.params.id);
    if (!foundBlog) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    return res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog);
  },
  getBlogsController: async (req: RequestWithQuery<GetBlogsQueryParamsModel>, res: Response<[] | PaginatedBlogsViewModel>) => {
    const result = await blogServices.getBlogs(createQueryParamsForBlogs(req.query));
    res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
  },
  getPostsByBlogIdController: async (
    req: RequestWithParamsAndQuery<GetByBlogIdURIParamsModel, GetPostsQueryParamsModel>,
    res: Response<PaginatedPostsViewModel>,
  ) => {
    const foundBlog = await blogServices.getBlog(req.params.blogId);
    if (!foundBlog) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    const queryParams: GetPostsQueryParamsModel = createQueryParamsForPosts(req.query);

    const result = await postServices.getPostsByBlogId(foundBlog.id, queryParams);
    return res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
  },
  updateBlogController: async (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<null | OutputErrorsType>) => {
    const isUpdated = await blogServices.updateBlog(req.params.id, req.body);
    if (!isUpdated) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
  },
};

blogsRouter.get("/", blogController.getBlogsController);
blogsRouter.get("/:id", blogController.getBlogController);
blogsRouter.post("/", ...createBlogValidators, blogController.createBlogController);
blogsRouter.put("/:id", updateBlogValidators, blogController.updateBlogController);
blogsRouter.delete("/:id", deleteBlogValidators, blogController.deleteBlogController);
blogsRouter.get("/:blogId/posts", blogController.getPostsByBlogIdController);
blogsRouter.post("/:blogId/posts", createPostByBlogIdValidators, blogController.createPostByBlogIdController);

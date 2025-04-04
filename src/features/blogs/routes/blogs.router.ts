import {Router, Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../../types";
import {SETTINGS} from "../../../settings";
import {BlogsViewModel, PaginatedBlogsViewModel} from "../models/BlogsViewModel";
import {BlogsURIParamsModel} from "../models/BlogsURIParamsModel";
import {BlogsCreateModel} from "../models/BlogsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {BlogsUpdateModel} from "../models/BlogsUpdateModel";
import {
    createBlogValidators, createPostByBlogIdValidators,
    deleteBlogValidators,
    updateBlogValidators
} from "../middleware/blogs.middleware";
import {GetBlogsQueryParamsModel} from "../models/GetBlogsQueryParamsModel";
import {createQueryParamsForBlogs, createQueryParamsForPosts} from "../../../utils";
import {GetPostsQueryParamsModel} from "../../posts/models/GetPostsQueryParamsModel";
import {postsRepository} from "../../../repository/mongo-db-posts-repository";
import {GetByBlogIdURIParamsModel} from "../models/GetByBlogIdURIParamsModel";
import {BlogPostInputModel} from "../models/BlogPostInputModel";
import {PaginatedPostsViewModel} from "../../../db/post-db-type";
import {PostsViewModel} from "../../posts/models/PostsViewModel";
import {blogServices} from "../services/blogs.service";
import {postServices} from "../../posts/service/posts.service";

export const blogsRouter = Router();

const blogController = {
    getBlogsController: async (req: RequestWithQuery<GetBlogsQueryParamsModel>, res: Response<PaginatedBlogsViewModel | []>) => {
        const result = await blogServices.getBlogs(createQueryParamsForBlogs(req.query));
        res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    },
    getBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response<BlogsViewModel>) => {
        const foundBlog = await blogServices.getBlog(req.params.id);
        foundBlog
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    getPostsByBlogIdController: async (req: RequestWithParamsAndQuery<GetByBlogIdURIParamsModel, GetPostsQueryParamsModel>, res: Response<PaginatedPostsViewModel>) => {
        const foundBlog = await blogServices.getBlog(req.params.blogId);
        if (!foundBlog) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
        const queryParams: GetPostsQueryParamsModel = createQueryParamsForPosts(req.query);

        const result = await postServices.getPostsByBlogId(foundBlog.id, queryParams);
        return res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    },
    createPostByBlogIdController: async (req: RequestWithParamsAndBody<GetByBlogIdURIParamsModel, BlogPostInputModel>, res: Response<PostsViewModel>) => {
        const foundBlog = await blogServices.getBlog(req.params.blogId);
        if (!foundBlog) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
        const newPost = await postServices.createPost({...req.body, blogId: foundBlog.id});
        return newPost
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    createBlogController: async (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>) => {
        const {name, websiteUrl, description} = req.body;
        const newBlog = await blogServices.createBlog({name, websiteUrl, description});
        newBlog
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

    },
    updateBlogController: async (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        await blogServices.updateBlog(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deleteBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response) => {
        await blogServices.deleteBlog(req.params.id)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

blogsRouter.get('/', blogController.getBlogsController)
blogsRouter.get('/:id', blogController.getBlogController)
blogsRouter.post('/', ...createBlogValidators, blogController.createBlogController)
blogsRouter.put('/:id', ...updateBlogValidators, blogController.updateBlogController)
blogsRouter.delete('/:id', ...deleteBlogValidators, blogController.deleteBlogController)
blogsRouter.get('/:blogId/posts', blogController.getPostsByBlogIdController)
blogsRouter.post('/:blogId/posts', ...createPostByBlogIdValidators, blogController.createPostByBlogIdController)

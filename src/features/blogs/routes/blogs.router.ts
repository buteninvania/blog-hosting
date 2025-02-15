import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {SETTINGS} from "../../../settings";
import {blogsRepository} from "../../../repository/blogs-repository";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {BlogsURIParamsModel} from "../models/BlogsURIParamsModel";
import {BlogsCreateModel} from "../models/BlogsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {BlogsUpdateModel} from "../models/BlogsUpdateModel";

export const blogsRouter = Router();

const blogController = {
    getBlogsController: (req: Request, res: Response<BlogsViewModel[] | []>) => {
        res.status(SETTINGS.HTTP_STATUSES.OK).json(blogsRepository.getBlogs());
    },
    getBlogController: (req: RequestWithParams<BlogsURIParamsModel>, res: Response<BlogsViewModel>) => {
        const foundBlog = blogsRepository.getBlogById(req.params.id);
        foundBlog
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createBlogController: (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>) => {
        const {name, websiteUrl, description} = req.body;

        const blogId = blogsRepository.createBlog(
            name, websiteUrl, description
        );

        const newBlog = blogsRepository.getBlogById(blogId);
        newBlog
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog)
            : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updateBlogController: (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        blogsRepository.updateBlog(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deleteBlogController: (req: RequestWithParams<BlogsURIParamsModel>, res: Response) => {
        blogsRepository.deleteBlog(req.params.id)
        ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

blogsRouter.get('/', blogController.getBlogsController)
blogsRouter.get('/:id', blogController.getBlogController)
blogsRouter.post('/',blogController.createBlogController)
blogsRouter.put('/:id', blogController.updateBlogController)
blogsRouter.delete('/:id', blogController.deleteBlogController)

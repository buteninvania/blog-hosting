import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {SETTINGS} from "../../../settings";
import {blogsRepository} from "../../../repository/blogs-repository";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {BlogsURIParamsModel} from "../models/BlogsURIParamsModel";
import {BlogsCreateModel} from "../models/BlogsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {BlogsUpdateModel} from "../models/BlogsUpdateModel";
import {createBlogValidators, deleteBlogValidators, updateBlogValidators} from "../middleware/blogs.middleware";

export const blogsRouter = Router();

const blogController = {
    getBlogsController: (req: Request, res: Response<BlogsViewModel[] | []>) => {
        res.status(SETTINGS.HTTP_STATUSES.OK).json(blogsRepository.getAll());
    },
    getBlogController: (req: RequestWithParams<BlogsURIParamsModel>, res: Response<BlogsViewModel>) => {
        const foundBlog = blogsRepository.get(req.params.id);
        foundBlog
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createBlogController: (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>) => {
        const {name, websiteUrl, description} = req.body;

        const blogId = blogsRepository.create({name, websiteUrl, description});

        const newBlog = blogsRepository.get(blogId);
        newBlog
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updateBlogController: (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        blogsRepository.put(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deleteBlogController: (req: RequestWithParams<BlogsURIParamsModel>, res: Response) => {
        blogsRepository.delete(req.params.id)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

blogsRouter.get('/', blogController.getBlogsController)
blogsRouter.get('/:id', blogController.getBlogController)
blogsRouter.post('/', ...createBlogValidators, blogController.createBlogController)
blogsRouter.put('/:id', ...updateBlogValidators, blogController.updateBlogController)
blogsRouter.delete('/:id', ...deleteBlogValidators, blogController.deleteBlogController)

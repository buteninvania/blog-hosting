import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {SETTINGS} from "../../../settings";
import {blogsRepository} from "../../../repository/blogs-repository";
import {blogsRepository as blogsRepositoryMongo} from "../../../repository/mongo-db-blogs-repository";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {BlogsURIParamsModel} from "../models/BlogsURIParamsModel";
import {BlogsCreateModel} from "../models/BlogsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {BlogsUpdateModel} from "../models/BlogsUpdateModel";
import {createBlogValidators, deleteBlogValidators, updateBlogValidators} from "../middleware/blogs.middleware";

export const blogsRouter = Router();

const blogController = {
    getBlogsController: async (req: Request, res: Response<BlogsViewModel[] | []>) => {
        // LOCAL MEMORY
        // res.status(SETTINGS.HTTP_STATUSES.OK).json(blogsRepository.getAll());

        const result = await blogsRepositoryMongo.getAll()
        res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    },
    getBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response<BlogsViewModel>) => {
        // LOCAL MEMORY
        // const foundBlog = blogsRepository.get(req.params.id);
        // foundBlog
        //     ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

        const foundBlog = await blogsRepositoryMongo.get(req.params.id);
        foundBlog
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createBlogController: async (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>) => {
        const {name, websiteUrl, description} = req.body;

        // LOCAL MEMORY
        // const blogId = blogsRepository.create({name, websiteUrl, description});
        // const newBlog = blogsRepository.get(blogId);
        // newBlog
        //     ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        const blogId = await blogsRepositoryMongo.create({name, websiteUrl, description});
        const newBlog = await blogsRepositoryMongo.get(blogId);
        blogId
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newBlog)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

    },
    updateBlogController: (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        blogsRepository.put(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deleteBlogController: async (req: RequestWithParams<BlogsURIParamsModel>, res: Response) => {
        // LOCAL MEMORY
        // blogsRepository.delete(req.params.id)
        //     ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

        await blogsRepositoryMongo.delete(req.params.id)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

blogsRouter.get('/', blogController.getBlogsController)
blogsRouter.get('/:id', blogController.getBlogController)
blogsRouter.post('/', ...createBlogValidators, blogController.createBlogController)
blogsRouter.put('/:id', ...updateBlogValidators, blogController.updateBlogController)
blogsRouter.delete('/:id', ...deleteBlogValidators, blogController.deleteBlogController)

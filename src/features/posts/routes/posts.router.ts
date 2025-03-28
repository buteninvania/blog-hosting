import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../../types";
import {SETTINGS} from "../../../settings";
import {PostsViewModel} from "../models/PostsViewModel";
import {PostsURIParamsModel} from "../models/PostsURIParamsModel";
import {PostsCreateModel} from "../models/PostsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {PostsUpdateModel} from "../models/PostsUpdateModel";
import {PaginatedPostsViewModel, PostDbType} from "../../../db/post-db-type";
import {postsRepository} from "../../../repository/mongo-db-posts-repository";
import {createPostValidators, deletePostValidators, updatePostValidators} from "../middleware/posts.middleware";
import {GetPostsQueryParamsModel} from "../models/GetPostsQueryParamsModel";
import {GetBlogsQueryParamsModel} from "../../blogs/models/GetBlogsQueryParamsModel";
import {createQueryParamsForBlogs, createQueryParamsForPosts} from "../../../utils";

export const postsRouter = Router();

const postController = {
    getPostsController: async (req: RequestWithQuery<GetPostsQueryParamsModel>, res: Response<PaginatedPostsViewModel>) => {
        // LOCAL MEMORY
        // res.status(SETTINGS.HTTP_STATUSES.OK).json(postsRepository.getAll());
        const queryParams: GetPostsQueryParamsModel = createQueryParamsForPosts(req.query)
        const result = await postsRepository.getAll(queryParams);
        res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    },
    getPostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response<PostsViewModel>) => {
        // LOCAL MEMORY
        // const foundPost = postsRepository.get(req.params.id);
        // foundPost
        //     ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundPost)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

        const foundPost = await postsRepository.get(req.params.id);
        foundPost
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundPost)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createPostController: async (req: RequestWithBody<PostsCreateModel>, res: Response<PostsViewModel | OutputErrorsType>) => {
        // LOCAL MEMORY
        // const postId = postsRepository.create(req.body);
        //
        // const newPost = postsRepository.get(postId);
        // newPost
        //     ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost)
        //     : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        const postId = await postsRepository.create(req.body);
        const newPost = await postsRepository.get(postId);
        newPost
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost)
            : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updatePostController: async (req: RequestWithParamsAndBody<PostsURIParamsModel, PostsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        // LOCAL MEMORY
        // postsRepository.put(req.params.id, req.body)
        //     ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

        await postsRepository.put(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deletePostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
        // LOCAL MEMORY
        // postsRepository.delete(req.params.id)
        //     ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        //     : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

        await postsRepository.delete(req.params.id)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

postsRouter.get('/', postController.getPostsController)
postsRouter.get('/:id', postController.getPostController)
postsRouter.post('/', ...createPostValidators, postController.createPostController)
postsRouter.put('/:id', ...updatePostValidators, postController.updatePostController)
postsRouter.delete('/:id', ...deletePostValidators, postController.deletePostController)

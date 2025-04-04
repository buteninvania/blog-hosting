import {Router, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../../types";
import {SETTINGS} from "../../../settings";
import {PostsViewModel} from "../models/PostsViewModel";
import {PostsURIParamsModel} from "../models/PostsURIParamsModel";
import {PostsCreateModel} from "../models/PostsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {PostsUpdateModel} from "../models/PostsUpdateModel";
import {PaginatedPostsViewModel} from "../../../db/post-db-type";
import {createPostValidators, deletePostValidators, updatePostValidators} from "../middleware/posts.middleware";
import {GetPostsQueryParamsModel} from "../models/GetPostsQueryParamsModel";
import {createQueryParamsForPosts} from "../../../utils";
import {postServices} from "../service/posts.service";

export const postsRouter = Router();

const postController = {
    getPostsController: async (req: RequestWithQuery<GetPostsQueryParamsModel>, res: Response<PaginatedPostsViewModel>) => {
        res.status(SETTINGS.HTTP_STATUSES.OK).json(await postServices.getPosts(createQueryParamsForPosts(req.query)));
    },
    getPostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response<PostsViewModel>) => {
        const foundPost = await postServices.getPost(req.params.id);
        foundPost
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundPost)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createPostController: async (req: RequestWithBody<PostsCreateModel>, res: Response<PostsViewModel | OutputErrorsType>) => {
        const newPost = await postServices.createPost(req.body);
        newPost
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost)
            : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updatePostController: async (req: RequestWithParamsAndBody<PostsURIParamsModel, PostsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        await postServices.updatePost(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deletePostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
        await postServices.deletePost(req.params.id)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

postsRouter.get('/', postController.getPostsController)
postsRouter.get('/:id', postController.getPostController)
postsRouter.post('/', ...createPostValidators, postController.createPostController)
postsRouter.put('/:id', ...updatePostValidators, postController.updatePostController)
postsRouter.delete('/:id', ...deletePostValidators, postController.deletePostController)

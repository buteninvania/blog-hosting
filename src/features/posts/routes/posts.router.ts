import {Router, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {SETTINGS} from "../../../settings";
import {PostsViewModel} from "../models/PostsViewModel";
import {PostsURIParamsModel} from "../models/PostsURIParamsModel";
import {PostsCreateModel} from "../models/PostsCreateModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {PostsUpdateModel} from "../models/PostsUpdateModel";
import {PostDbType} from "../../../db/post-db-type";
import {postsRepository} from "../../../repository/posts-repository";

export const postsRouter = Router();

const postController = {
    getPostsController: (req: Request, res: Response<PostDbType[]>) => {
        res.status(SETTINGS.HTTP_STATUSES.OK).json(postsRepository.getPosts());
    },
    getPostController: (req: RequestWithParams<PostsURIParamsModel>, res: Response<PostsViewModel>) => {
        const foundPost = postsRepository.getPostById(req.params.id);
        foundPost
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundPost)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createPostController: (req: RequestWithBody<PostsCreateModel>, res: Response<PostsViewModel | OutputErrorsType>) => {
        const {title, shortDescription, content, blogId} = req.body;

        const postId = postsRepository.createPost(req.body);

        const newPost = postsRepository.getPostById(postId);
        newPost
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost)
            : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updatePostController: (req: RequestWithParamsAndBody<PostsURIParamsModel, PostsUpdateModel>, res: Response<OutputErrorsType | null>) => {
        postsRepository.updatePost(req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deletePostController: (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
        postsRepository.deletePost(req.params.id)
        ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

postsRouter.get('/', postController.getPostsController)
postsRouter.get('/:id', postController.getPostController)
postsRouter.post('/',postController.createPostController)
postsRouter.put('/:id', postController.updatePostController)
postsRouter.delete('/:id', postController.deletePostController)

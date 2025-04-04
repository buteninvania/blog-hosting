import { PaginatedPostsViewModel } from "@/db/post-db-type";
import { SETTINGS } from "@/settings";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "@/types";
import { createQueryParamsForPosts } from "@/utils";
import { Response, Router } from "express";

import { OutputErrorsType } from "../../types/output-errors-type";
import { createPostValidators, deletePostValidators, updatePostValidators } from "../middleware/posts.middleware";
import { GetPostsQueryParamsModel } from "../models/GetPostsQueryParamsModel";
import { PostsCreateModel } from "../models/PostsCreateModel";
import { PostsUpdateModel } from "../models/PostsUpdateModel";
import { PostsURIParamsModel } from "../models/PostsURIParamsModel";
import { PostsViewModel } from "../models/PostsViewModel";
import { postServices } from "../service/posts.service";

export const postsRouter = Router();

const postController = {
  createPostController: async (req: RequestWithBody<PostsCreateModel>, res: Response<OutputErrorsType | PostsViewModel>) => {
    const newPost = await postServices.createPost(req.body);
    newPost ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newPost) : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
  },
  deletePostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
    (await postServices.deletePost(req.params.id))
      ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
      : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  },
  getPostController: async (req: RequestWithParams<PostsURIParamsModel>, res: Response<PostsViewModel>) => {
    const foundPost = await postServices.getPost(req.params.id);
    foundPost ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundPost) : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  },
  getPostsController: async (req: RequestWithQuery<GetPostsQueryParamsModel>, res: Response<PaginatedPostsViewModel>) => {
    res.status(SETTINGS.HTTP_STATUSES.OK).json(await postServices.getPosts(createQueryParamsForPosts(req.query)));
  },
  updatePostController: async (req: RequestWithParamsAndBody<PostsURIParamsModel, PostsUpdateModel>, res: Response<null | OutputErrorsType>) => {
    (await postServices.updatePost(req.params.id, req.body))
      ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
      : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  },
};

postsRouter.get("/", postController.getPostsController);
postsRouter.get("/:id", postController.getPostController);
postsRouter.post("/", ...createPostValidators, postController.createPostController);
postsRouter.put("/:id", ...updatePostValidators, postController.updatePostController);
postsRouter.delete("/:id", ...deletePostValidators, postController.deletePostController);

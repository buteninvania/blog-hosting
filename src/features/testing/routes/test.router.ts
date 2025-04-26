import { Request, Response, Router } from "express";

import { blogsRepository } from "../../../repository/mongo-db-blogs-repository";
import { postsRepository } from "../../../repository/mongo-db-posts-repository";
import { usersRepository } from "../../../repository/mongo-db-users-repository";
import { SETTINGS } from "../../../settings";

export const testRouter = Router();

const testController = {
  clearDatabase: async (req: Request, res: Response) => {
    await postsRepository.deleteAll();
    await blogsRepository.deleteAll();
    await usersRepository.deleteAll();
    res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
  },
};

testRouter.delete("/all-data", testController.clearDatabase);

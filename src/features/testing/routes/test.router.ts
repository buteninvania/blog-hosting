import {Router, Request, Response} from "express";
import {postsRepository} from "../../../repository/mongo-db-posts-repository";
import {blogsRepository} from "../../../repository/mongo-db-blogs-repository";
import {SETTINGS} from "../../../settings";

export const testRouter = Router();

const testController = {
    clearDatabase: async (req: Request, res: Response) => {
        // LOCAL MEMORY
        // db.blogs = [];
        // db.posts = [];
        // res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        await postsRepository.deleteAll();
        await blogsRepository.deleteAll();
        res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
    }
}

testRouter.delete('/all-data', testController.clearDatabase)

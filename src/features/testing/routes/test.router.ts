import {Router, Request, Response} from "express";
import { db } from "../../../db/db";
import { SETTINGS } from "../../../settings";

export const testRouter = Router();

const testController = {
    clearDatabase: (req: Request, res: Response) => {
        db.blogs = [];
        db.posts = [];
        res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
    }
}

testRouter.delete('/all-data', testController.clearDatabase)

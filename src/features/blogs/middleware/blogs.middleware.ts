import {body} from "express-validator";
import { adminMiddleware } from "../../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { NextFunction, Request, Response } from "express";
import { blogsRepository as blogsRepositoryMongo } from "../../../repository/mongo-db-blogs-repository";
import { SETTINGS } from "../../../settings";
import {contentValidator, shortDescriptionValidator, titleValidator} from "../../posts/middleware/posts.middleware";

export const nameValidator = body('name')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 15}).withMessage('more then 15 or 0')

export const descriptionValidator = body('description')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500}).withMessage('more then 500 or 0')

export const websiteUrlValidator = body('websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const findBlogValidator = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const foundValidator = await blogsRepositoryMongo.get(req.params.id);
    if (foundValidator) {
        next()
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    }
}

export const findBlogIdValidator = async (req: Request<{blogId: string}>, res: Response, next: NextFunction) => {
    const foundValidator = await blogsRepositoryMongo.get(req.params.blogId);
    if (foundValidator) {
        next()
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    }
}

export const createBlogValidators = [
    adminMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    inputCheckErrorsMiddleware
];

export const deleteBlogValidators = [
    adminMiddleware,
    findBlogValidator
]
export const updateBlogValidators = [
    adminMiddleware,
    findBlogValidator,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    inputCheckErrorsMiddleware
]

export const createPostByBlogIdValidators = [
    adminMiddleware,
    findBlogIdValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    inputCheckErrorsMiddleware
]

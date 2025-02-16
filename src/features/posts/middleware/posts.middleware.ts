import {body} from "express-validator";
import {adminMiddleware} from "../../../global-middlewares/admin-middleware";
import {inputCheckErrorsMiddleware} from "../../../global-middlewares/inputCheckErrorsMiddleware";
import {blogsRepository} from "../../../repository/blogs-repository";
import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../../../settings";
import {postsRepository} from "../../../repository/posts-repository";

export const titleValidator = body('title')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 30}).withMessage('more then 30 or 0')

export const shortDescriptionValidator = body('shortDescription')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('more then 10 or 0')

export const contentValidator = body('content')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0')


export const findBlogValidator = body('blogId')
    .isString().withMessage('blogId not string').trim().custom((value) => {
        const foundValidator = blogsRepository.get(value);
        if (!foundValidator) {
            throw new Error('There is no blog with such a BlogId.');
        }
        return true
    })

export const findPostValidator = (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const foundValidator = postsRepository.get(req.params.id);
    if (foundValidator) {
        next()
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    }
}

export const createPostValidators = [
    adminMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    findBlogValidator,
    inputCheckErrorsMiddleware
];

export const updatePostValidators = [
    adminMiddleware,
    findPostValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    findBlogValidator,
    inputCheckErrorsMiddleware
]

export const deletePostValidators = [
    adminMiddleware,
    findPostValidator,
    inputCheckErrorsMiddleware
]

import {body} from "express-validator";
import { adminMiddleware } from "../../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { NextFunction, Request, Response } from "express";
import { blogsRepository as blogsRepositoryMongo } from "../../../repository/mongo-db-blogs-repository";
import { SETTINGS } from "../../../settings";
import {GetBlogsQueryParamsModel} from "../models/GetBlogsQueryParamsModel";

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

export const getBlogsQueryParamsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        searchNameTerm,
        sortBy = "createdAt",
        sortDirection = "desc",
        pageNumber = 1,
        pageSize = 10,
    } = req.query;

    const queryParams: GetBlogsQueryParamsModel = {
        searchNameTerm: searchNameTerm as string | null,
        sortBy: sortBy as string,
        sortDirection: sortDirection as "asc" | "desc",
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
    };

    if (queryParams.sortDirection !== "asc" && queryParams.sortDirection !== "desc") {
        queryParams.sortDirection = "desc";
    }

    Object.assign(req.query, queryParams)

    next();
};

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

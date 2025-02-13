import {RequestWithBody, RequestWithParamsAndBody} from "../../../types";
import {Response} from "express";
import {SETTINGS} from "../../../settings";
import {BlogsCreateModel} from "../models/BlogsCreateModel";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {createInputValidation, updateInputValidation} from "../validator/blog-data-validator";
import {BlogsURIParamsModel} from "../models/BlogsURIParamsModel";
import {BlogsUpdateModel} from "../models/BlogsUpdateModel";

export const createInputMiddleware = (req: RequestWithBody<BlogsCreateModel>, res: Response<BlogsViewModel | OutputErrorsType>, next: () => void) => {
    const errorsMessages = createInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}

export const updateInputMiddleware = (req: RequestWithParamsAndBody<BlogsURIParamsModel, BlogsUpdateModel>, res: Response<OutputErrorsType | null>, next: () => void) => {
    const errorsMessages = updateInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}

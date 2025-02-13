import {RequestWithBody, RequestWithParamsAndBody} from "../../../types";
import {Response} from "express";
import {SETTINGS} from "../../../settings";
import {PostsCreateModel} from "../models/PostsCreateModel";
import {PostsViewModel} from "../models/PostsViewModel";
import {OutputErrorsType} from "../../types/output-errors-type";
import {createInputValidation, updateInputValidation} from "../validator/posts-data-validator";
import {PostsURIParamsModel} from "../models/PostsURIParamsModel";
import {PostsUpdateModel} from "../models/PostsUpdateModel";

export const createInputMiddleware = (req: RequestWithBody<PostsCreateModel>, res: Response<PostsViewModel | OutputErrorsType>, next: () => void) => {
    const errorsMessages = createInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}

export const updateInputMiddleware = (req: RequestWithParamsAndBody<PostsURIParamsModel, PostsUpdateModel>, res: Response<OutputErrorsType | null>, next: () => void) => {
    const errorsMessages = updateInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}

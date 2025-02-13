import {OutputErrorsType} from "../../types/output-errors-type";
import {PostsCreateModel} from "../models/PostsCreateModel";

export const createInputValidation = (post: PostsCreateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    return errors
}

export const updateInputValidation = (post: PostsCreateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    return errors
}

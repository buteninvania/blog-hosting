import {OutputErrorsType} from "../../types/output-errors-type";
import {BlogsCreateModel} from "../models/BlogsCreateModel";

export const createInputValidation = (blog: BlogsCreateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    return errors
}

export const updateInputValidation = (blog: BlogsCreateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    return errors
}

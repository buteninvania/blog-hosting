import { BlogsCreateModel } from "../blogs/models/BlogsCreateModel"
import { PostsCreateModel } from "../posts/models/PostsCreateModel"

export type FieldNamesType = keyof BlogsCreateModel | keyof PostsCreateModel

export type OutputErrorsType = {
    errorsMessages?: FieldError[]
}

type FieldError = {
    message?: string
    field?: string
}

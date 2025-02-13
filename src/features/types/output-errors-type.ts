export type OutputErrorsType = {
    errorsMessages?: FieldError[]
}

type FieldError = {
    message?: string
    field?: string
}

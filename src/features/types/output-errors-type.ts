import { BlogsCreateModel } from "../blogs/models/BlogsCreateModel";
import { PostsCreateModel } from "../posts/models/PostsCreateModel";

export type FieldNamesType = keyof BlogsCreateModel | keyof PostsCreateModel;

export interface OutputErrorsType {
  errorsMessages?: FieldError[];
}

interface FieldError {
  field?: string;
  message?: string;
}

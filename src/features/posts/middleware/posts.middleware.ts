import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { adminMiddleware } from "../../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { SETTINGS } from "../../../settings";
import { blogServices } from "../../blogs/services/blogs.service";
import { postServices } from "../service/posts.service";

export const titleValidator = body("title")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 30, min: 1 })
  .withMessage("more then 30 or 0");

export const shortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 100, min: 1 })
  .withMessage("more then 10 or 0");

export const contentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 1000, min: 1 })
  .withMessage("more then 1000 or 0");

export const findBlogValidator = body("blogId")
  .isString()
  .withMessage("blogId not string")
  .trim()
  .custom(async (value: string) => {
    const foundValidator = await blogServices.getBlog(value);
    if (!foundValidator) {
      throw new Error("There is no blog with such a BlogId.");
    }
    return true;
  });

export const findPostValidator = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const foundValidator = await postServices.getPost(req.params.id);
  if (foundValidator) {
    next();
  } else {
    res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  }
};

export const createPostValidators = [
  adminMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  findBlogValidator,
  inputCheckErrorsMiddleware,
];

export const updatePostValidators = [
  adminMiddleware,
  findPostValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  findBlogValidator,
  inputCheckErrorsMiddleware,
];

export const deletePostValidators = [adminMiddleware, findPostValidator, inputCheckErrorsMiddleware];

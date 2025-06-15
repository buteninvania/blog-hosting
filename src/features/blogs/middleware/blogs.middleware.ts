import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { adminMiddleware } from "../../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { blogsRepository as blogsRepositoryMongo } from "../../../repository/mongo-db-blogs-repository";
import { SETTINGS } from "../../../settings";
import { contentValidator, shortDescriptionValidator, titleValidator } from "../../posts/middleware/posts.middleware";

export const nameValidator = body("name").isString().withMessage("not string").trim().isLength({ max: 15, min: 1 }).withMessage("more then 15 or 0");

export const descriptionValidator = body("description")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 500, min: 1 })
  .withMessage("more then 500 or 0");

export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isURL()
  .withMessage("not url")
  .isLength({ max: 100, min: 1 })
  .withMessage("more then 100 or 0");

export const findBlogValidator = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id || req.params.blogId;
  const foundValidator = await blogsRepositoryMongo.get(id);

  if (!foundValidator) {
    res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    return;
  }
  next();
};

export const createBlogValidators = [adminMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, inputCheckErrorsMiddleware];

export const deleteBlogValidators = [adminMiddleware, findBlogValidator];
export const updateBlogValidators = [
  adminMiddleware,
  findBlogValidator,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  inputCheckErrorsMiddleware,
];

export const createPostByBlogIdValidators = [
  adminMiddleware,
  findBlogValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputCheckErrorsMiddleware,
];

import { UsersURIParamsModel } from "@/features/users/models/UsersURIParamsModel";
import { userServices } from "@/features/users/service/users.service";
import { adminMiddleware } from "@/global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "@/global-middlewares/inputCheckErrorsMiddleware";
import { SETTINGS } from "@/settings";
import { RequestWithParams } from "@/types";
import { NextFunction, Response } from "express";
import { body } from "express-validator";

export const loginValidator = body("login")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 10, min: 3 })
  .withMessage("more then 10 or 3")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("invalid login");

export const passwordValidator = body("password")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ max: 20, min: 6 })
  .withMessage("more then 20 or 6");

export const findUserValidator = async (req: RequestWithParams<UsersURIParamsModel>, res: Response, next: NextFunction) => {
  const foundValidator = await userServices.getUser(req.params.id);
  if (foundValidator) {
    next();
  } else {
    res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  }
};

export const emailValidator = body("email").isString().withMessage("not string").trim().isEmail().withMessage("invalid email");

export const getUserValidators = [adminMiddleware, inputCheckErrorsMiddleware];

export const createUserValidators = [loginValidator, passwordValidator, emailValidator, adminMiddleware, inputCheckErrorsMiddleware];

export const deleteUserValidators = [adminMiddleware, inputCheckErrorsMiddleware];

import { body } from "express-validator";

import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";

export const loginOrEmailValidator = body("loginOrEmail").isString().withMessage("not string").trim();

export const passwordValidator = body("password").isString().withMessage("not string").trim();

export const loginValidators = [loginOrEmailValidator, passwordValidator, inputCheckErrorsMiddleware];

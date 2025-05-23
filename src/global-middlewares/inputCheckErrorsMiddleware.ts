import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { FieldNamesType, OutputErrorsType } from "../features/types/output-errors-type";

export const inputCheckErrorsMiddleware = (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    const eArray = e.array({ onlyFirstError: true }) as { msg: string; path: FieldNamesType }[];

    return res.status(400).json({
      errorsMessages: eArray.map((x) => ({ field: x.path, message: x.msg })),
    });
  }

  next();
};

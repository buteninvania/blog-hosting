import { Response, Router } from "express";

import { SETTINGS } from "../../../settings";
import { RequestWithBody } from "../../../types";
import { OutputErrorsType } from "../../types/output-errors-type";
import { loginValidators } from "../middleware/auth.middleware";
import { LoginInputModel } from "../models/LoginInputModel";
import { LoginSuccessViewModel } from "../models/LoginSuccessViewModel";
import { authService } from "../services/auth.service";

export const authRouter = Router();

const authController = {
  loginController: async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel | OutputErrorsType>) => {
    try {
      const { loginOrEmail, password } = req.body;
      const result = await authService.login({ loginOrEmail, password });
      res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    } catch (e) {
      return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);
    }
  },
};

authRouter.post("/login", loginValidators, authController.loginController);

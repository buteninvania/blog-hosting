import { Request, Response, Router } from "express";

import { SETTINGS } from "../../../settings";
import { RequestWithBody } from "../../../types";
import { OutputErrorsType } from "../../types/output-errors-type";
import { loginValidators } from "../middleware/auth.middleware";
import { LoginInputModel } from "../models/LoginInputModel";
import { LoginSuccessViewModel } from "../models/LoginSuccessViewModel";
import { MeSuccessViewModel } from "../models/MeSuccessViewModel";
import { authService } from "../services/auth.service";

export const authRouter = Router();

const authController = {
  loginController: async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel | OutputErrorsType>) => {
    try {
      const { loginOrEmail, password } = req.body;
      const result = await authService.login({ loginOrEmail, password });
      return res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    } catch (e) {
      return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);
    }
  },
  meController: async (req: Request, res: Response<MeSuccessViewModel | OutputErrorsType>) => {
    try {
      const token = req.headers.authorization?.slice(7);
      if (!token) return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);

      const result = await authService.authorize(token);
      if (!result) return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);
      return res.status(SETTINGS.HTTP_STATUSES.OK).json(result);
    } catch (e) {
      return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);
    }
  },
};

authRouter.post("/login", loginValidators, authController.loginController);
authRouter.get("/me", authController.meController);

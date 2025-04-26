import { Response, Router } from "express";

import { SETTINGS } from "../../../settings";
import { RequestWithBody } from "../../../types";
import { loginValidators } from "../middleware/auth.middleware";
import { LoginInputModel } from "../models/LoginInputModel";
import { authService } from "../services/auth.service";

export const authRouter = Router();

const authController = {
  loginController: async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;
    const result = await authService.login({ loginOrEmail, password });
    if (!result) {
      return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_AUTH);
    }
    return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
  },
};

authRouter.post("/login", loginValidators, authController.loginController);

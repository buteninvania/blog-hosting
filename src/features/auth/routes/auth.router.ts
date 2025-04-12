import { loginValidators } from "@/features/auth/middleware/auth.middleware";
import { LoginInputModel } from "@/features/auth/models/LoginInputModel";
import { authService } from "@/features/auth/services/auth.service";
import { SETTINGS } from "@/settings";
import { RequestWithBody } from "@/types";
import { Response, Router } from "express";

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

import { Response, Router } from "express";

import { fromUTF8ToBase64 } from "../../../global-middlewares/admin-middleware";
import { SETTINGS } from "../../../settings";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../../../types";
import { createQueryParamsForUsers } from "../../../utils";
import { OutputErrorsType } from "../../types/output-errors-type";
import { createUserValidators, getUserValidators } from "../middleware/users.middleware";
import { GetUsersQueryParamsModel } from "../models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "../models/UsersCreateModel";
import { UsersURIParamsModel } from "../models/UsersURIParamsModel";
import { PaginatedUsersViewModel, UsersViewModel } from "../models/UsersViewModel";
import { userServices } from "../service/users.service";

export const usersRouter = Router();

const userController = {
  createUserController: async (req: RequestWithBody<UsersCreateModel>, res: Response<OutputErrorsType | UsersViewModel>) => {
    try {
      const user = await userServices.createUser(req.body);
      if (!user) return res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST).send();
      return res.status(SETTINGS.HTTP_STATUSES.CREATED).json(user);
    } catch (e) {
      const errorsMessages = [{ field: "email", message: "email should be unique" }];
      return res.status(400).json({ errorsMessages });
    }
  },
  deleteUserController: async (req: RequestWithParams<UsersURIParamsModel>, res: Response) => {
    // TODO: Refactoring is needed
    const auth = req.headers.authorization!;

    if (!auth) {
      res.status(401).json({});
      return;
    }

    if (!auth.startsWith("Basic ")) {
      res.status(401).json({});
      return;
    }

    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

    if (auth.slice(6) !== codedAuth) {
      res.status(401).json({});
      return;
    }

    const foundValidator = await userServices.getUser(req.params.id);
    if (!foundValidator) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);

    const isDeleted = await userServices.deleteUser(req.params.id);
    if (!isDeleted) return res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    return res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
  },
  getUsersController: async (req: RequestWithQuery<GetUsersQueryParamsModel>, res: Response<OutputErrorsType | PaginatedUsersViewModel>) => {
    const users = await userServices.getUsers(createQueryParamsForUsers(req.query));
    return res.status(SETTINGS.HTTP_STATUSES.OK).json(users);
  },
};

usersRouter.get("/", getUserValidators, userController.getUsersController);
usersRouter.post("/", createUserValidators, userController.createUserController);
usersRouter.delete("/:id", userController.deleteUserController);

import { userServices } from "@/features/users/service/users.service";
import { SETTINGS } from "@/settings";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "@/types";
import { createQueryParamsForUsers } from "@/utils";
import { Response, Router } from "express";

import { OutputErrorsType } from "../../types/output-errors-type";
import { GetUsersQueryParamsModel } from "../models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "../models/UsersCreateModel";
import { UsersURIParamsModel } from "../models/UsersURIParamsModel";
import { PaginatedUsersViewModel, UsersViewModel } from "../models/UsersViewModel";

export const usersRouter = Router();

const userController = {
  createUserController: async (req: RequestWithBody<UsersCreateModel>, res: Response<OutputErrorsType | UsersViewModel>) => {
    const user = await userServices.createUser(req.body);
    user ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(user) : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
  },
  deleteUserController: async (req: RequestWithParams<UsersURIParamsModel>, res: Response) => {
    (await userServices.deleteUser(req.params.id))
      ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
      : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  },
  getUsersController: async (req: RequestWithQuery<GetUsersQueryParamsModel>, res: Response<PaginatedUsersViewModel>) => {
    return res.status(SETTINGS.HTTP_STATUSES.OK).json(await userServices.getUsers(createQueryParamsForUsers(req.query)));
  },
};

usersRouter.get("/", userController.getUsersController);
usersRouter.post("/", userController.createUserController);
usersRouter.delete("/:id", userController.deleteUserController);

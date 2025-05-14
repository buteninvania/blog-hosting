import { jwtService } from "../../../application/jwt.service";
import { usersRepository } from "../../../repository/mongo-db-users-repository";
import { createQueryParamsForUsers } from "../../../utils";
import { GetUsersQueryParamsModel } from "../../users/models/GetUsersQueryParamsModel";
import { UsersViewModel } from "../../users/models/UsersViewModel";
import { LoginInputModel } from "../models/LoginInputModel";
import { LoginSuccessViewModel } from "../models/LoginSuccessViewModel";

export const authService = {
  checkCredentials: async (loginData: LoginInputModel): Promise<null | UsersViewModel> => {
    const { loginOrEmail, password } = loginData;

    const queryParams: GetUsersQueryParamsModel = createQueryParamsForUsers({
      searchEmailTerm: loginOrEmail,
      searchLoginTerm: loginOrEmail,
    });

    const users = await usersRepository.getAll(queryParams);
    if (!users.items.length) return null;

    const isPasswordCorrect = await usersRepository.comparePassword(users.items[0].id, password);
    if (!isPasswordCorrect) return null;

    return users.items[0];
  },
  login: async (loginData: LoginInputModel): Promise<LoginSuccessViewModel> => {
    const { loginOrEmail, password } = loginData;

    const queryParams: GetUsersQueryParamsModel = createQueryParamsForUsers({
      searchEmailTerm: loginOrEmail,
      searchLoginTerm: loginOrEmail,
    });

    const user = await usersRepository.getAll(queryParams);
    if (!user.items.length) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await usersRepository.comparePassword(user.items[0].id, password);
    if (!isPasswordCorrect) {
      throw new Error("Password is incorrect");
    }

    return {
      accessToken: jwtService.createJWT(user.items[0]),
    };
  },
};

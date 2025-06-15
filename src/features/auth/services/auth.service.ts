import { jwtService } from "../../../application/jwt.service";
import { usersRepository } from "../../../repository/mongo-db-users-repository";
import { createQueryParamsForUsers } from "../../../utils";
import { GetUsersQueryParamsModel } from "../../users/models/GetUsersQueryParamsModel";
import { MeViewModel } from "../../users/models/MeViewModel";
import { LoginInputModel } from "../models/LoginInputModel";
import { LoginSuccessViewModel } from "../models/LoginSuccessViewModel";

export const authService = {
  authorize: async (token: string): Promise<MeViewModel | null> => {
    const userId = jwtService.getUserId(token);
    if (!userId) {
      throw new Error("Нет такого пользователя");
    }
    const userData = await usersRepository.get(userId);
    if (!userData) {
      throw new Error("Нет такого пользователя");
    }

    return {
      email: userData.email,
      id: userData.id,
      login: userData.login,
    };
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

    const token = jwtService.createJWT(user.items[0]);
    if (!token) {
      throw new Error("Token is not created");
    }

    return {
      accessToken: token,
    };
  },
};

import { LoginInputModel } from "@/features/auth/models/LoginInputModel";
import { GetUsersQueryParamsModel } from "@/features/users/models/GetUsersQueryParamsModel";
import { usersRepository } from "@/repository/mongo-db-users-repository";
import { createQueryParamsForUsers } from "@/utils";

export const authService = {
  login: async (loginData: LoginInputModel): Promise<boolean> => {
    const { loginOrEmail, password } = loginData;
    const queryParams: GetUsersQueryParamsModel = createQueryParamsForUsers({
      searchEmailTerm: loginOrEmail,
      searchLoginTerm: loginOrEmail,
    });
    const user = await usersRepository.getAll(queryParams);
    if (!user.items.length) return false;
    return await usersRepository.comparePassword(user.items[0].id, password);
  },
};

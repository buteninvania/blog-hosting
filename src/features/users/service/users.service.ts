import { PaginatedUsersViewModel } from "@/db/user-db-type";
import { usersRepository } from "@/repository/mongo-db-users-repository";

import { GetUsersQueryParamsModel } from "../models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "../models/UsersCreateModel";

export const userServices = {
  createUser: async (userData: UsersCreateModel) => {
    const findUser = await usersRepository.getUserByEmail(userData.email);
    if (findUser) {
      throw new Error("User with this email already exists");
    }
    const userId = await usersRepository.create(userData);
    return await usersRepository.get(userId);
  },
  deleteUser: async (id: string) => {
    return await usersRepository.delete(id);
  },
  getUser: async (id: string) => {
    return await usersRepository.get(id);
  },
  getUsers: async (queryParams: GetUsersQueryParamsModel) => {
    return await usersRepository.getAll(queryParams);
  },
};

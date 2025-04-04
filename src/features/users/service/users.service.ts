import { usersRepository } from "@/repository/mongo-db-users-repository";

import { GetUsersQueryParamsModel } from "../models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "../models/UsersCreateModel";

export const userServices = {
  createUser: async (userData: UsersCreateModel) => {
    return await usersRepository.create(userData);
  },
  deleteUser: async (id: string) => {
    return await usersRepository.delete(id);
  },
  getUsers: async (queryParams: GetUsersQueryParamsModel) => {
    return await usersRepository.getAll(queryParams);
  },
};

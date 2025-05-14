import { compare, genSaltSync, hashSync } from "bcrypt";
import { Filter } from "mongodb";

import { userCollection } from "../db/mongo-db";
import { UserDbType, UserViewModel } from "../db/user-db-type";
import { GetUsersQueryParamsModel } from "../features/users/models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "../features/users/models/UsersCreateModel";
import { PaginatedUsersViewModel } from "../features/users/models/UsersViewModel";

export const usersRepository = {
  async comparePassword(userId: string, password: string): Promise<boolean> {
    const user = await userCollection.findOne({ id: userId });
    if (!user) return false;

    return await compare(password, user.password);
  },
  async create(user: UsersCreateModel): Promise<string> {
    const id = new Date().toISOString() + Math.random();

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(user.password, salt);

    const newUser: UserDbType = {
      createdAt: new Date().toISOString(),
      email: user.email,
      id,
      login: user.login,
      password: hashedPassword,
    };
    await userCollection.insertOne(newUser);
    return newUser.id;
  },
  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const foundUser = await this.get(id);
    if (!foundUser) return false;
    await userCollection.deleteOne({ id });
    return true;
  },
  async deleteAll(): Promise<boolean> {
    await userCollection.deleteMany({});
    return true;
  },
  async get(id: string): Promise<null | UserViewModel> {
    const user = await userCollection.findOne({ id });
    if (!user) return null;
    return this.map(user);
  },
  async getAll(params: GetUsersQueryParamsModel): Promise<PaginatedUsersViewModel> {
    const { pageNumber = 1, pageSize = 10, searchEmailTerm = null, searchLoginTerm = null, sortBy = "createdAt", sortDirection = "desc" } = params;

    const filter: Filter<UserDbType> = {};

    if (searchEmailTerm || searchLoginTerm) {
      filter.$or = [];

      if (searchEmailTerm) {
        filter.$or.push({
          email: { $options: "i", $regex: searchEmailTerm },
        });
      }

      if (searchLoginTerm) {
        filter.$or.push({
          login: { $options: "i", $regex: searchLoginTerm },
        });
      }
    }

    const sortOptions: Record<string, -1 | 1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;
    }

    const totalCount = await userCollection.countDocuments(filter);
    const items = await userCollection
      .find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: items.map((user) => this.map(user)),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  },
  async getUserByEmail(email: string): Promise<null | UserViewModel> {
    const user = await userCollection.findOne({ email });
    if (!user) return null;
    return this.map(user);
  },
  map(user: UserDbType): UserViewModel {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      login: user.login,
    };
  },
};

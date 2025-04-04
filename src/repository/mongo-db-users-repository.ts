import { userCollection } from "@/db/mongo-db";
import { UserDbType } from "@/db/user-db-type";
import { GetUsersQueryParamsModel } from "@/features/users/models/GetUsersQueryParamsModel";
import { UsersCreateModel } from "@/features/users/models/UsersCreateModel";
import { PaginatedUsersViewModel } from "@/features/users/models/UsersViewModel";

export const usersRepository = {
  async create(user: UsersCreateModel): Promise<string> {
    const newUser: UserDbType = {
      createdAt: new Date().toISOString(),
      email: user.email,
      id: new Date().toISOString() + Math.random(),
      login: user.login,
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
  async get(id: string): Promise<null | UserDbType> {
    const user = await userCollection.findOne({ id });
    if (!user) return null;
    return this.map(user);
  },
  async getAll(params: GetUsersQueryParamsModel): Promise<PaginatedUsersViewModel> {
    const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = params;

    const sortOptions: Record<string, -1 | 1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;
    }

    const totalCount = await userCollection.countDocuments();
    const items = await userCollection
      .find()
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
  map(user: UserDbType): UserDbType {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      login: user.login,
    };
  },
};

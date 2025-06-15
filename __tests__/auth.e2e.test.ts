import { req } from "./test.helpers";
import { SETTINGS } from "../src/settings";
import { UserDbType } from "../src/db/user-db-type";
import { UsersCreateModel } from "../src/features/users/models/UsersCreateModel";
import { usersTestManager } from "./utils/usersTestManager";
import { codedAuth } from "./utils/datasets";

describe(`e2e tests pack for router ${SETTINGS.PATH.AUTH}`, () => {
  let firstUserCreated: UserDbType;
  let accessToken: string;

  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
  });

  // 1) создать пользователя
  // 2) получть созданного пользователя
  // 3) сделать авторизацию и получить токен

  it("should get empty array and 201", async () => {
    const res = await req
      .get(SETTINGS.PATH.USERS)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTP_STATUSES.OK);
    expect(res.body.items.length).toBe(0);
  });

  it("should create first user and 201", async () => {
    const newUser: UsersCreateModel = {
      login: "login1",
      password: "password1",
      email: "email1@gmail.com",
    };

    const { response, createdEntity } = await usersTestManager.createUser(newUser, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    firstUserCreated = createdEntity;

    const foundUser = await req.get(`${SETTINGS.PATH.USERS}?searchLoginTerm=${firstUserCreated.login}`).set({ Authorization: "Basic " + codedAuth });
    expect(createdEntity).toEqual(foundUser.body.items[0]);
  });

  it("should be authorized and return the authorization token and 200", async () => {
    const res = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: firstUserCreated.login,
        password: "password1",
      })
      .expect(SETTINGS.HTTP_STATUSES.OK);

    expect(res.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(res.body).toEqual({
      accessToken: expect.any(String),
    });

    accessToken = res.body.accessToken;
  });
  it("should be must receive the user's data using the token and 200", async () => {
    const res = await req
      .get(`${SETTINGS.PATH.AUTH}/me`)
      .set({ Authorization: "Bearer " + accessToken })
      .expect(SETTINGS.HTTP_STATUSES.OK);

    expect(res.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(res.body).toEqual({
      id: firstUserCreated.id,
      login: firstUserCreated.login,
      email: firstUserCreated.email,
    });
  });
});

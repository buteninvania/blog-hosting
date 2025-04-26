import { req } from "./test.helpers";
import { SETTINGS } from "../src/settings";
import { codedAuth, createString } from "./utils/datasets";
import { UserDbType } from "../src/db/user-db-type";
import { UsersCreateModel } from "../src/features/users/models/UsersCreateModel";
import { usersTestManager } from "./utils/usersTestManager";

describe(`e2e tests pack for router ${SETTINGS.PATH.USERS}`, () => {
  let firstUserCreated: UserDbType;
  let secondUserCreated: UserDbType;

  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
  });

  it("should get empty array and 401", async () => {
    await req.get(SETTINGS.PATH.USERS).expect(SETTINGS.HTTP_STATUSES.NO_AUTH);
  });
  it("should get empty array and 201", async () => {
    const res = await req
      .get(SETTINGS.PATH.USERS)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTP_STATUSES.OK);
    expect(res.body.items.length).toBe(0);
  });
  it("shouldn't create and 401", async () => {
    const newUser: UsersCreateModel = {
      login: "login1",
      email: "email1@gmail.com",
      password: "pass1",
    };

    const { response } = await usersTestManager.createUser(newUser, null, SETTINGS.HTTP_STATUSES.NO_AUTH);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);
  });
  it("shouldn't create and 400", async () => {
    const newUser: UsersCreateModel = {
      login: createString(1),
      password: createString(5),
      email: "email1@gmail",
    };

    const { response } = await usersTestManager.createUser(newUser, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);

    expect(response.body.errorsMessages.length).toEqual(3);
    expect(response.body.errorsMessages[0].field).toEqual("login");
    expect(response.body.errorsMessages[1].field).toEqual("password");
    expect(response.body.errorsMessages[2].field).toEqual("email");

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
  it("should create second user and 201", async () => {
    const newUser: UsersCreateModel = {
      login: "login2",
      password: "password2",
      email: "email2@gmail.com",
    };

    const { response, createdEntity } = await usersTestManager.createUser(newUser, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    secondUserCreated = createdEntity;

    const foundUser = await req.get(`${SETTINGS.PATH.USERS}?searchLoginTerm=${secondUserCreated.login}`).set({ Authorization: "Basic " + codedAuth });
    expect(secondUserCreated).toEqual(foundUser.body.items[0]);
    expect(foundUser.body.items[0].login).toEqual(secondUserCreated.login);

    const allUsers = await req.get(SETTINGS.PATH.USERS).set({ Authorization: "Basic " + codedAuth });
    expect(allUsers.body.items.length).toEqual(2);
  });
  it("should create 10 users", async () => {
    for (let i = 3; i < 13; i++) {
      const newUser: UsersCreateModel = {
        login: createString(9),
        password: createString(8),
        email: `email${i}@gmail.com`,
      };

      await usersTestManager.createUser(newUser, codedAuth);
    }

    const allUsers = await req.get(`${SETTINGS.PATH.USERS}/?pageNumber=2`).set({ Authorization: "Basic " + codedAuth });
    expect(allUsers.body.items.length).toEqual(2);
    expect(allUsers.body.page).toEqual(2);
  });

  it("shouldn't create and 400 if user already exists", async () => {
    const newUser: UsersCreateModel = {
      login: "login1",
      email: "email1@gmail.com",
      password: "password1",
    };

    const { response } = await usersTestManager.createUser(newUser, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual("email");
  });

  it("should delete all users and 204", async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
    const resultUsers = await req.get(`${SETTINGS.PATH.USERS}`).set({ Authorization: "Basic " + codedAuth });
    expect(resultUsers.body.items.length).toEqual(0);
  });
});

import { UsersCreateModel } from "../../src/features/users/models/UsersCreateModel";
import { HTTP_STATUS_TYPE, SETTINGS } from "../../src/settings";
import { req } from "../test.helpers";

export const usersTestManager = {
  createUser: async (data: UsersCreateModel, codedAuth: string | null = null, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED) => {
    const response = await req
      .post(`${SETTINGS.PATH.USERS}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data)
      .expect(statusCode);

    let createdEntity;

    if (statusCode === SETTINGS.HTTP_STATUSES.CREATED) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        email: data.email,
        login: data.login,
      });
    }

    return { response, createdEntity };
  },
};

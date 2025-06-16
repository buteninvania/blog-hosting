import { req } from "../test.helpers";
import { HTTP_STATUS_TYPE, SETTINGS } from "../../src/settings";
import { PostsCreateModel } from "../../src/features/posts/models/PostsCreateModel";
import { PostsUpdateModel } from "../../src/features/posts/models/PostsUpdateModel";
import { CommentInputModel } from "../../src/features/comments/models/CommentInputModel";

export const postsTestManager = {
  createPost: async (data: PostsCreateModel, codedAuth: string | null = null, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED) => {
    const response = await req
      .post(`${SETTINGS.PATH.POSTS}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data)
      .expect(statusCode);

    let createdEntity;

    if (statusCode === SETTINGS.HTTP_STATUSES.CREATED) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        blogName: expect.any(String),
        createdAt: expect.any(String),
        ...data,
      });
    }

    return { response, createdEntity };
  },
  updatePost: async (
    data: PostsUpdateModel,
    id: string = "404",
    codedAuth: string | null = null,
    statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.NO_CONTENT,
  ) => {
    const response = await req
      .put(`${SETTINGS.PATH.POSTS}/${id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data)
      .expect(statusCode);

    return { response };
  },
  createComment: async (
    data: CommentInputModel,
    postId: string,
    tokenAccess: string,
    statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED,
  ) => {
    const response = await req
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .set({ Authorization: "Bearer " + tokenAccess })
      .send(data)
      .expect(statusCode);

    return { response };
  },
};

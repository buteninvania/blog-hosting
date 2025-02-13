import {req} from "../test.helpers";
import {HTTP_STATUS_TYPE, SETTINGS} from "../../src/settings";
import {PostsCreateModel} from "../../src/features/posts/models/PostsCreateModel";

export const postsTestManager = {
    createPost: async (data: PostsCreateModel, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED) => {
        const response = await req
            .post(`${SETTINGS.PATH.POSTS}`)
            .send(data)
            .expect(statusCode)

        let createdEntity;

        if (statusCode === SETTINGS.HTTP_STATUSES.CREATED) {
            createdEntity = response.body;

            expect(createdEntity).toEqual({
                id: expect.any(Number),
                ...data
            })
        }

        return {response, createdEntity}
    },
}

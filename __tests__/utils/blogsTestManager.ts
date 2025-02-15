import {req} from "../test.helpers";
import {HTTP_STATUS_TYPE, SETTINGS} from "../../src/settings";
import {BlogsCreateModel} from "../../src/features/blogs/models/BlogsCreateModel";
import {codedAuth} from "./datasets"

export const blogsTestManager = {
    createBlog: async (data: BlogsCreateModel, codedAuth: string | null = null, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED) => {
        const response = await req
            .post(`${SETTINGS.PATH.BLOGS}`)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(statusCode)

        let createdEntity;

        if (statusCode === SETTINGS.HTTP_STATUSES.CREATED) {
            createdEntity = response.body;

            expect(createdEntity).toEqual({
                id: expect.any(String),
                ...data
            })
        }

        return {response, createdEntity}
    },
}

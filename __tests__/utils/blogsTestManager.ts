import {req} from "../test.helpers";
import {HTTP_STATUS_TYPE, SETTINGS} from "../../src/settings";
import {BlogsCreateModel} from "../../src/features/blogs/models/BlogsCreateModel";
import {BlogsUpdateModel} from "../../src/features/blogs/models/BlogsUpdateModel";

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
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean),
                ...data
            })
        }

        return {response, createdEntity}
    },
    updateBlog: async (data: BlogsUpdateModel, id: string = '404', codedAuth: string | null = null, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.NO_CONTENT) => {
        const response = await req
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(statusCode)

        return {response}
    },
}

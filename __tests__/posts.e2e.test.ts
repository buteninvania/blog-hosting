import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {PostDbType} from "../src/db/post-db-type";

describe(`A pack of e2e tests for the router ${SETTINGS.PATH.POSTS}`, () => {
    let firstPostCreated: PostDbType
    let secondPostCreated: PostDbType

    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING);
    })

    it('should return 200 and get empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.length).toBe(0)

    })
    it('should not return the post and return the 404 status code', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/1`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)

    })
})

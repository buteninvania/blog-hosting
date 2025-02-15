import { req } from "./test.helpers";
import { SETTINGS } from "../src/settings";
import { BlogDbType } from "../src/db/blog-db-type";
import { BlogsCreateModel } from "../src/features/blogs/models/BlogsCreateModel";
import { blogsTestManager } from "./utils/blogsTestManager";

describe(`A pack of e2e tests for the router ${SETTINGS.PATH.BLOGS}`, () => {
    let firstBlogCreated: BlogDbType
    let secondBlogCreated: BlogDbType

    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING);
    })

    it('should get empty array and 200', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.length).toBe(0)
    })
    it('shouln\'t find and 404', async () => {
        await req
            .get(`${SETTINGS.PATH.BLOGS}/1`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })

    it('should create', async () => {
        const newBlog: BlogsCreateModel = {
            name: "n1",
            description: "d1",
            websiteUrl: "http://some.com"
        }

        const {createdEntity, response} = await blogsTestManager.createBlog(newBlog)
        
        
        
    })
})

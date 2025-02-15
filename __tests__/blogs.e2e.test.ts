import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {BlogDbType} from "../src/db/blog-db-type";
import {BlogsCreateModel} from "../src/features/blogs/models/BlogsCreateModel";
import {blogsTestManager} from "./utils/blogsTestManager";
import {codedAuth, createString} from "./utils/datasets";

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

        const {response, createdEntity} = await blogsTestManager.createBlog(newBlog, codedAuth)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED)

        firstBlogCreated = createdEntity

        const foundBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${createdEntity.id}`)
        expect(createdEntity).toEqual(foundBlog.body)
    })
    it('shouldn\'t create and 401', async () => {
        const newBlog: BlogsCreateModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
        }

        const {response} = await blogsTestManager.createBlog(newBlog, null, SETTINGS.HTTP_STATUSES.NO_AUTH)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH)

        const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`)

        expect(resultBlogs.body.length).toEqual(1)
    })
    it('shouldn\'t create and 400', async () => {
        const newBlog: BlogsCreateModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const {response} = await blogsTestManager.createBlog(newBlog, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.body.errorsMessages.length).toEqual(3)

        expect(response.body.errorsMessages[0].field).toEqual('name')
        expect(response.body.errorsMessages[1].field).toEqual('description')
        expect(response.body.errorsMessages[2].field).toEqual('websiteUrl')

        const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`)
        expect(resultBlogs.body.length).toEqual(1)
    })
    it('shouldn\'t del and 401', async () => {
        await req
            .delete(SETTINGS.PATH.BLOGS + '/' + firstBlogCreated.id)
            .set({'Authorization': 'Basic ' + "xyz"})
            .expect(SETTINGS.HTTP_STATUSES.NO_AUTH)


        const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`)
        expect(resultBlogs.body.length).toEqual(1)
    })
    it('should del and 204', async () => {
        await req
            .delete(SETTINGS.PATH.BLOGS + '/' + firstBlogCreated.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)


        const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`)
        expect(resultBlogs.body.length).toEqual(0)
    })
    it('shouldn\'t del and 404', async () => {
        await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
})

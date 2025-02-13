import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {BlogDbType} from "../src/db/blog-db-type";
import {blogsTestManager} from "./utils/blogsTestManager";
import {BlogsCreateModel} from "../src/features/blogs/models/BlogsCreateModel";
import {BlogsUpdateModel} from "../src/features/blogs/models/BlogsUpdateModel";

describe(`A pack of e2e tests for the router ${SETTINGS.PATH.BLOGS}`, () => {
    let firstBlogCreated: BlogDbType
    let secondBlogCreated: BlogDbType

    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING);
    })

    it('should return 200 and get empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.length).toBe(0)

    })
    it('should not return the blog and return the 404 status code', async () => {
        await req
            .get(`${SETTINGS.PATH.BLOGS}/1`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)

    })
    it(`it should not create an entity and return the 400 status with an error of incorrect data`, async () => {
        const data: BlogDbType = {description: "", id: "", name: "", websiteUrl: ""}

        const {response, createdEntity} = await blogsTestManager
            .createBlog(data, SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    })
    it(`must create a new blog and return the 201 status and data of the new blog`, async () => {
        const data: BlogDbType = {description: "", id: "", name: "", websiteUrl: ""}

        const {response, createdEntity} = await blogsTestManager
            .createBlog(data)

         firstBlogCreated = createdEntity;

        expect(response.body.description).toBe('Naruto Shippuden')

        const allBlogs = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allBlogs.body.length).toBe(1)

        const foundBlogResult = await req
            .get(`${SETTINGS.PATH.BLOGS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundBlogResult.body).toEqual({
            id: createdEntity.id,
            title: createdEntity.title,
            author: createdEntity.author,
            availableResolution: createdEntity.availableResolution,
        })
    })
    it(`i have to add another blog and return 201 status, and there should be a total of 2 blogs in the database.`, async () => {
        const data: BlogsCreateModel = {description: "", name: "", websiteUrl: ""}
        const {response, createdEntity} = await blogsTestManager
            .createBlog(data)

        secondBlogCreated = createdEntity

        expect(response.body.description).toBe('Jujutsu Kaisen')

        const allBlogs = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allBlogs.body.length).toBe(2)

        const foundBlogsResult = await req
            .get(`${SETTINGS.PATH.BLOGS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundBlogsResult.body).toEqual({
            blogId: "",
            blogName: "",
            content: "",
            id: "",
            shortDescription: "",
            title: "",
        })
    })
    it(`should update one of the blogs and return the 204 status`, async () => {
        const data: BlogsCreateModel = {description: "", name: "", websiteUrl: ""}
        const firstBlogId: string = firstBlogCreated.id
        await req
            .put(`${SETTINGS.PATH.BLOGS}/${firstBlogId}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        const allBlogs = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allBlogs.body.length).toBe(2)

        const foundBlogResult = await req
            .get(`${SETTINGS.PATH.POSTS}/${firstBlogId}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundBlogResult.body.blogId).toBe("")
    })
    it(`should status code 404 since there is no such blog.`, async () => {
        const data: BlogsUpdateModel = {description: "", name: "", websiteUrl: ""}
        const notFoundBlog: number = 404

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${notFoundBlog}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
    it(`should not delete the blog because it is not in the database and return a 404 error`, async () => {
        const fakeBlogId = 404
        await req
            .delete(`${SETTINGS.PATH.POSTS}/${fakeBlogId}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
    it(`should to delete the blogs in the database one by one and check for an empty database.`, async () => {
        await req
            .delete(`${SETTINGS.PATH.POSTS}/${firstBlogCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        let allBlogs = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allBlogs.body.length).toBe(1)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        allBlogs = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allBlogs.body.length).toBe(0)

    })
})

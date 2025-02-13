import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {PostDbType} from "../src/db/post-db-type";
import {PostsViewModel} from "../src/features/posts/models/PostsViewModel";
import {postsTestManager} from "./utils/postsTestManager";
import {PostsCreateModel} from "../src/features/posts/models/PostsCreateModel";
import {PostsUpdateModel} from "../src/features/posts/models/PostsUpdateModel";

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
    it(`it should not create an entity and return the 400 status with an error of incorrect data`, async () => {
        const data: PostsViewModel = {
            blogId: "",
            blogName: "",
            content: "",
            id: "",
            shortDescription: "",
            title: ""
        }

        const {response, createdEntity} = await postsTestManager
            .createPost(data, SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    })
    it(`must create a new post and return the 201 status and data of the new post`, async () => {
        const data: PostsViewModel = {blogId: "", blogName: "", content: "", id: "", shortDescription: "", title: ""}

        const {response, createdEntity} = await postsTestManager
            .createPost(data)

        firstPostCreated = createdEntity;

        expect(response.body.blogId).toBe('Naruto Shippuden')

        const allPosts = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allPosts.body.length).toBe(1)

        const foundPostResult = await req
            .get(`${SETTINGS.PATH.POSTS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundPostResult.body).toEqual({
            id: createdEntity.id,
            title: createdEntity.title,
            author: createdEntity.author,
            availableResolution: createdEntity.availableResolution,
        })
    })
    it(`i have to add another post and return 201 status, and there should be a total of 2 posts in the database.`, async () => {
        const data: PostsCreateModel = {blogId: "", content: "", shortDescription: "", title: ""}
        const {response, createdEntity} = await postsTestManager
            .createPost(data)

        secondPostCreated = createdEntity

        expect(response.body.blogId).toBe('Jujutsu Kaisen')

        const allPosts = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allPosts.body.length).toBe(2)

        const foundPostsResult = await req
            .get(`${SETTINGS.PATH.POSTS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundPostsResult.body).toEqual({
            blogId: "",
            blogName: "",
            content: "",
            id: "",
            shortDescription: "",
            title: "",
        })
    })
    it(`should update one of the posts and return the 204 status`, async () => {
        const data: PostsCreateModel = {blogId: "", content: "", shortDescription: "", title: ""}
        const firstPostId: string = firstPostCreated.id
        await req
            .put(`${SETTINGS.PATH.POSTS}/${firstPostId}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        const allPosts = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allPosts.body.length).toBe(2)

        const foundVideoResult = await req
            .get(`${SETTINGS.PATH.POSTS}/${firstPostId}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundVideoResult.body.blogId).toBe("")
    })
    it(`should status code 404 since there is no such post.`, async () => {
        const data: PostsUpdateModel = {blogId: "", content: "", shortDescription: "", title: ""}
        const notFoundPost: number = 404

        await req
            .put(`${SETTINGS.PATH.POSTS}/${notFoundPost}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
    it(`should not delete the video because it is not in the database and return a 404 error`, async () => {
        const fakePostId = 404
        await req
            .delete(`${SETTINGS.PATH.POSTS}/${fakePostId}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
    it(`should to delete the posts in the database one by one and check for an empty database.`, async () => {
        await req
            .delete(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        let allPosts = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allPosts.body.length).toBe(1)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${secondPostCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        allPosts = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allPosts.body.length).toBe(0)

    })
})

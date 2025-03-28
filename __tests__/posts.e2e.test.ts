import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {PostDbType} from "../src/db/post-db-type";
import {PostsCreateModel} from "../src/features/posts/models/PostsCreateModel";
import {codedAuth, createString} from "./utils/datasets";
import {postsTestManager} from "./utils/postsTestManager";
import {BlogsCreateModel} from "../src/features/blogs/models/BlogsCreateModel";
import {blogsTestManager} from "./utils/blogsTestManager";
import {BlogDbType} from "../src/db/blog-db-type";

describe(`e2e tests pack for router ${SETTINGS.PATH.POSTS}`, () => {
    let firstBlogCreated: BlogDbType
    let secondBlogCreated: BlogDbType

    let firstPostCreated: PostDbType
    let secondPostCreated: PostDbType

    beforeAll(async () => {
        await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
    })

    it('should get empty array and 200', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.items.length).toBe(0)
    })
    it('shouldn\'t find and 404', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/1`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)

    })
    it('shouldn\'t create and 401', async () => {
        const newPost: PostsCreateModel = {
            title: 'p1',
            content: 'c1',
            shortDescription: 's1',
            blogId: '1'
        }

        const {response} = await postsTestManager.createPost(newPost, null, SETTINGS.HTTP_STATUSES.NO_AUTH)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH)
    })
    it('shouldn\'t create and 400', async () => {
        const newPost: PostsCreateModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1'
        }

        const {response} = await postsTestManager.createPost(newPost, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.body.errorsMessages.length).toEqual(4)
        expect(response.body.errorsMessages[0].field).toEqual('title')
        expect(response.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(response.body.errorsMessages[2].field).toEqual('content')
        expect(response.body.errorsMessages[3].field).toEqual('blogId')

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.items.length).toBe(0)
    })
    it('should create first blog and 201', async () => {
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
    it('should create first post and 201', async () => {
        const newPost: PostsCreateModel = {
            title: 'p1',
            content: 'c1',
            shortDescription: 's1',
            blogId: firstBlogCreated.id
        }

        const {response, createdEntity} = await postsTestManager.createPost(newPost, codedAuth)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED)

        firstPostCreated = createdEntity

        const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`)
        expect(firstPostCreated).toEqual(foundPost.body)
        expect(foundPost.body.blogName).toEqual(firstBlogCreated.name)
    })
    it('should create second blog and 201', async () => {
        const newBlog: BlogsCreateModel = {
            name: "n2",
            description: "d2",
            websiteUrl: "http://some.com"
        }

        const {response, createdEntity} = await blogsTestManager.createBlog(newBlog, codedAuth)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED)

        secondBlogCreated = createdEntity

        const foundBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`)
        expect(secondBlogCreated).toEqual(foundBlog.body)
    })
    it('should create second post and 201', async () => {
        const newPost: PostsCreateModel = {
            title: 'p2',
            content: 'c2',
            shortDescription: 's2',
            blogId: secondBlogCreated.id
        }

        const {response, createdEntity} = await postsTestManager.createPost(newPost, codedAuth)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED)

        secondPostCreated = createdEntity

        const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${secondPostCreated.id}`)
        expect(secondPostCreated).toEqual(foundPost.body)
        expect(foundPost.body.blogName).toEqual(secondBlogCreated.name)

        const allPosts = await req.get(SETTINGS.PATH.POSTS)

        expect(allPosts.body.items.length).toEqual(2)

        const allBlogs = await req.get(SETTINGS.PATH.BLOGS)
        expect(allBlogs.body.items.length).toEqual(2)
    })
    it('should update first post and 204', async () => {
        const data = {
            title: 'edit p1',
            content: 'c1',
            shortDescription: 's1',
            blogId: firstBlogCreated.id
        }
        const {response} = await postsTestManager.updatePost(data, firstPostCreated.id, codedAuth)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`)
        firstPostCreated = foundPost.body
        expect(firstPostCreated.title).toEqual(data.title)
    })
    it('shouldn\'t update and 404', async () => {
        const data = {
            title: 'edit p1',
            content: 'c1',
            shortDescription: 's1',
            blogId: firstBlogCreated.id
        }
        const {response} = await postsTestManager.updatePost(data, "404", codedAuth, SETTINGS.HTTP_STATUSES.NOT_FOUND)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })
    it('shouldn\'t update and 400', async () => {
        const data = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1'
        }

        const {response} = await postsTestManager.updatePost(data, firstPostCreated.id, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.body.errorsMessages.length).toEqual(4)
        expect(response.body.errorsMessages[0].field).toEqual('title')
        expect(response.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(response.body.errorsMessages[2].field).toEqual('content')
        expect(response.body.errorsMessages[3].field).toEqual('blogId')

        const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`)
        expect(firstPostCreated).toEqual(foundPost.body)
    })
    it('shouldn\'t update and 401', async () => {
        const data = {
            title: createString(29),
            content: createString(999),
            shortDescription: createString(99),
            blogId: firstBlogCreated.id
        }

        const {response} = await postsTestManager.updatePost(data, firstPostCreated.id, null, SETTINGS.HTTP_STATUSES.NO_AUTH)
        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH)

        const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`)
        expect(firstPostCreated).toEqual(foundPost.body)
    })
    it('should create 100 posts and return the posts of the second country', async () => {
        for (let i = 0; i < 100; i++) {
            const newPost: PostsCreateModel = {
                title: 'p' + i,
                content: 'c' + i,
                shortDescription: 's' + i,
                blogId: secondBlogCreated.id
            }

            await postsTestManager.createPost(newPost, codedAuth)
        }

        const allPosts = await req.get(`${SETTINGS.PATH.POSTS}/?pageNumber=2`)
        expect(allPosts.body.items.length).toEqual(10)
        expect(allPosts.body.page).toEqual(2)
    })
})

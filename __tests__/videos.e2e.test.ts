import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {postsTestManager} from "./utils/postsTestManager";
import {VideosCreateModel} from "../src/features/videos/models/VideosCreateModel";
import {VideosUpdateModel} from "../src/features/videos/models/VideosUpdateModel";
import {VideoDbType} from "../src/db/video-db-type";

describe(`A pack of e2e tests for the router ${SETTINGS.PATH.VIDEOS}`, () => {
    let firstVideoCreated: VideoDbType
    let secondVideoCreated: VideoDbType

    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING);
    })

    it('should return 200 and get empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(res.body.length).toBe(0)

    })

    it('should not return the video and return the 404 status code', async () => {
        await req
            .get(`${SETTINGS.PATH.VIDEOS}/1`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)

    })

    it(`it should not create an entity and return the 400 status with an error of incorrect data`, async () => {
        const data: VideosCreateModel = {title: '', author: 'Ivan', availableResolution: ['P144']}

        const {response, createdEntity} = await postsTestManager
            .createVideo(data, SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        expect(response.body.errorsMessages?.length).toBe(1)
        expect(response.body.errorsMessages?.[0].message).toBe('title is a required field')
        expect(response.body.errorsMessages?.[0].field).toBe('title')
        expect(createdEntity).toBeUndefined()
    })

    it(`must create a new video and return the 201 status and data of the new video`, async () => {
        const data: VideosCreateModel = {title: 'Naruto Shippuden', author: 'Ivan', availableResolution: ['P144', "P240", "P480", "P720"]}

        const {response, createdEntity} = await postsTestManager
            .createVideo(data)

        firstVideoCreated = createdEntity;

        expect(response.body.title).toBe('Naruto Shippuden')
        expect(response.body.author).toBe('Ivan')

        const allVideos = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allVideos.body.length).toBe(1)

        const foundVideoResult = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundVideoResult.body).toEqual({
            id: createdEntity.id,
            title: createdEntity.title,
            author: createdEntity.author,
            availableResolution: createdEntity.availableResolution,
        })
    })

    it(`i have to add another video and return 201 status, and there should be a total of 2 videos in the database.`, async () => {
        const data: VideosCreateModel = {title: 'Jujutsu Kaisen', author: 'Ivan', availableResolution: ["P240", "P480", "P720"]}

        const {response, createdEntity} = await postsTestManager
            .createVideo(data)

        secondVideoCreated = createdEntity

        expect(response.body.title).toBe('Jujutsu Kaisen')
        expect(response.body.author).toBe('Ivan')

        const allVideos = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allVideos.body.length).toBe(2)

        const foundVideoResult = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundVideoResult.body).toEqual({
            id: createdEntity.id,
            title: createdEntity.title,
            author: createdEntity.author,
            availableResolution: createdEntity.availableResolution,
        })
    })

    it(`should update one of the videos and return the 204 status`, async () => {
        const data: VideosUpdateModel = {title: "Naruto Shippuden Episode 1 Season 1", author: "Ivan"}
        const firstVideoId: number = firstVideoCreated.id
        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${firstVideoId}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        const allVideos = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allVideos.body.length).toBe(2)

        const foundVideoResult = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${firstVideoId}`)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(foundVideoResult.body.title).toBe("Naruto Shippuden Episode 1 Season 1")
        expect(foundVideoResult.body.author).toBe("Ivan")
    })

    it(`should status code 404 since there is no such video.`, async () => {
        const data: VideosUpdateModel = {title: "Naruto Shippuden Episode 2 Season 1", author: "Ivan"}
        const notFoundVideo: number = 404

        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${notFoundVideo}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })

    it(`should status 400 since the age is over 18 years old`, async () => {
        const data: VideosUpdateModel = {title: "Naruto Shippuden Episode 2 Season 1", author: "Ivan", minAgeRestriction: 19}
        const notFoundVideo: number = firstVideoCreated.id

        const response = await req
            .put(`${SETTINGS.PATH.VIDEOS}/${notFoundVideo}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.body.errorsMessages?.[0].message).toBe(`The maximum age limit is no more than 18 years, and you have ${data.minAgeRestriction}`)
        expect(response.body.errorsMessages?.[0].field).toBe('minAgeRestriction')
    })

    it(`should status 400 since the age is less than 1 year`, async () => {
        const data: VideosUpdateModel = {title: "Naruto Shippuden Episode 2 Season 1", author: "Ivan", minAgeRestriction: 0}
        const notFoundVideo: number = firstVideoCreated.id

        const response = await req
            .put(`${SETTINGS.PATH.VIDEOS}/${notFoundVideo}`)
            .send(data)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST)

        expect(response.body.errorsMessages?.[0].message).toBe(`The minimum age limit is at least 1 year, and you have ${data.minAgeRestriction}`)
        expect(response.body.errorsMessages?.[0].field).toBe('minAgeRestriction')
    })

    it(`should not delete the video because it is not in the database and return a 404 error`, async () => {
        const fakeVideoId = 404
        await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${fakeVideoId}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND)
    })

    it(`should to delete the videos in the database one by one and check for an empty database.`, async () => {
        await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${firstVideoCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        let allVideos = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allVideos.body.length).toBe(1)

        await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${secondVideoCreated.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT)

        allVideos = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(SETTINGS.HTTP_STATUSES.OK)

        expect(allVideos.body.length).toBe(0)

    })

})

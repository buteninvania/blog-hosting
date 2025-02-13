import {config} from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data'
    },
    HTTP_STATUSES: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,

        BAD_REQUEST: 400,
        NOT_FOUND: 404
    }
}

type HTTP_STATUS_KEYS = keyof typeof SETTINGS.HTTP_STATUSES;
export type HTTP_STATUS_TYPE = (typeof SETTINGS.HTTP_STATUSES)[HTTP_STATUS_KEYS];

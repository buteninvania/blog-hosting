import { config } from 'dotenv';
config();

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URL_TEST
    : process.env.MONGO_URL;

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing'
    },
    HTTP_STATUSES: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,

        BAD_REQUEST: 400,
        NO_AUTH: 401,
        NOT_FOUND: 404
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGODB_URI: MONGODB_URI || 'mongodb://localhost:27017',
    DB_NAME: "buteninvania",
    BLOG_COLLECTION_NAME: "blogs",
    POST_COLLECTION_NAME: "posts"
}

type HTTP_STATUS_KEYS = keyof typeof SETTINGS.HTTP_STATUSES;
export type HTTP_STATUS_TYPE = (typeof SETTINGS.HTTP_STATUSES)[HTTP_STATUS_KEYS];

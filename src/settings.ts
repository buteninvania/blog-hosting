import { config } from "dotenv";
config();

const MONGODB_URI = process.env.NODE_ENV === "test" ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

export const SETTINGS = {
  ADMIN: process.env.ADMIN ?? "admin:qwerty",
  BLOG_COLLECTION_NAME: "blogs",
  DB_NAME: "buteninvania",
  HTTP_STATUSES: {
    BAD_REQUEST: 400,
    CREATED: 201,
    NO_AUTH: 401,

    NO_CONTENT: 204,
    NOT_FOUND: 404,
    OK: 200,
  },
  JWT_SECRET: "blog",
  MONGODB_URI: MONGODB_URI ?? "mongodb://localhost:27017",
  PATH: {
    AUTH: "/auth",
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTING: "/testing",
    USERS: "/users",
  },
  PORT: process.env.PORT ?? 3003,
  POST_COLLECTION_NAME: "posts",
  USER_COLLECTION_NAME: "users",
};

export type HTTP_STATUS_TYPE = (typeof SETTINGS.HTTP_STATUSES)[HTTP_STATUS_KEYS];
type HTTP_STATUS_KEYS = keyof typeof SETTINGS.HTTP_STATUSES;

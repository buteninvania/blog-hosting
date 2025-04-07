import cors from "cors";
import express from "express";

import { blogsRouter } from "./features/blogs/routes/blogs.router";
import { postsRouter } from "./features/posts/routes/posts.router";
import { testRouter } from "./features/testing/routes/test.router";
import { usersRouter } from "./features/users/routes/users.router";
import { SETTINGS } from "./settings";

export const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.TESTING, testRouter);

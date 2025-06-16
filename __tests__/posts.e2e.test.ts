import { req } from "./test.helpers";
import { SETTINGS } from "../src/settings";
import { PostDbType } from "../src/db/post-db-type";
import { PostsCreateModel } from "../src/features/posts/models/PostsCreateModel";
import { codedAuth, createString } from "./utils/datasets";
import { postsTestManager } from "./utils/postsTestManager";
import { BlogsCreateModel } from "../src/features/blogs/models/BlogsCreateModel";
import { blogsTestManager } from "./utils/blogsTestManager";
import { BlogDbType } from "../src/db/blog-db-type";
import { PostsViewModel } from "../src/features/posts/models/PostsViewModel";
import { usersTestManager } from "./utils/usersTestManager";
import { authRouter } from "../src/features/auth/routes/auth.router";

describe(`e2e tests pack for router ${SETTINGS.PATH.POSTS}`, () => {
  let firstBlogCreated: BlogDbType;
  let secondBlogCreated: BlogDbType;

  let firstPostCreated: PostDbType;
  let secondPostCreated: PostDbType;

  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
  });

  it("should get empty array and 200", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(SETTINGS.HTTP_STATUSES.OK);

    expect(res.body.items.length).toBe(0);
  });
  it("shouldn't find and 404", async () => {
    await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  it("shouldn't create and 401", async () => {
    const newPost: PostsCreateModel = {
      title: "p1",
      content: "c1",
      shortDescription: "s1",
      blogId: "1",
    };

    const { response } = await postsTestManager.createPost(newPost, null, SETTINGS.HTTP_STATUSES.NO_AUTH);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);
  });
  it("shouldn't create and 400", async () => {
    const newPost: PostsCreateModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: "1",
    };

    const { response } = await postsTestManager.createPost(newPost, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);

    expect(response.body.errorsMessages.length).toEqual(4);
    expect(response.body.errorsMessages[0].field).toEqual("title");
    expect(response.body.errorsMessages[1].field).toEqual("shortDescription");
    expect(response.body.errorsMessages[2].field).toEqual("content");
    expect(response.body.errorsMessages[3].field).toEqual("blogId");

    const res = await req.get(SETTINGS.PATH.POSTS).expect(SETTINGS.HTTP_STATUSES.OK);

    expect(res.body.items.length).toBe(0);
  });
  it("should create first blog and 201", async () => {
    const newBlog: BlogsCreateModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const { response, createdEntity } = await blogsTestManager.createBlog(newBlog, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    firstBlogCreated = createdEntity;

    const foundBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${createdEntity.id}`);
    expect(createdEntity).toEqual(foundBlog.body);
  });
  it("should create first post and 201", async () => {
    const newPost: PostsCreateModel = {
      title: "p1",
      content: "c1",
      shortDescription: "s1",
      blogId: firstBlogCreated.id,
    };

    const { response, createdEntity } = await postsTestManager.createPost(newPost, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    firstPostCreated = createdEntity;

    const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`);
    expect(firstPostCreated).toEqual(foundPost.body);
    expect(foundPost.body.blogName).toEqual(firstBlogCreated.name);
  });
  it("should create second blog and 201", async () => {
    const newBlog: BlogsCreateModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://some.com",
    };

    const { response, createdEntity } = await blogsTestManager.createBlog(newBlog, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    secondBlogCreated = createdEntity;

    const foundBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`);
    expect(secondBlogCreated).toEqual(foundBlog.body);
  });
  it("should create second post and 201", async () => {
    const newPost: PostsCreateModel = {
      title: "p2",
      content: "c2",
      shortDescription: "s2",
      blogId: secondBlogCreated.id,
    };

    const { response, createdEntity } = await postsTestManager.createPost(newPost, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    secondPostCreated = createdEntity;

    const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${secondPostCreated.id}`);
    expect(secondPostCreated).toEqual(foundPost.body);
    expect(foundPost.body.blogName).toEqual(secondBlogCreated.name);

    const allPosts = await req.get(SETTINGS.PATH.POSTS);

    expect(allPosts.body.items.length).toEqual(2);

    const allBlogs = await req.get(SETTINGS.PATH.BLOGS);
    expect(allBlogs.body.items.length).toEqual(2);
  });
  it("should update first post and 204", async () => {
    const data = {
      title: "edit p1",
      content: "c1",
      shortDescription: "s1",
      blogId: firstBlogCreated.id,
    };
    const { response } = await postsTestManager.updatePost(data, firstPostCreated.id, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_CONTENT);

    const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`);
    firstPostCreated = foundPost.body;
    expect(firstPostCreated.title).toEqual(data.title);
  });
  it("shouldn't update and 404", async () => {
    const data = {
      title: "edit p1",
      content: "c1",
      shortDescription: "s1",
      blogId: firstBlogCreated.id,
    };
    const { response } = await postsTestManager.updatePost(data, "404", codedAuth, SETTINGS.HTTP_STATUSES.NOT_FOUND);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  it("shouldn't update and 400", async () => {
    const data = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: "1",
    };

    const { response } = await postsTestManager.updatePost(data, firstPostCreated.id, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);

    expect(response.body.errorsMessages.length).toEqual(4);
    expect(response.body.errorsMessages[0].field).toEqual("title");
    expect(response.body.errorsMessages[1].field).toEqual("shortDescription");
    expect(response.body.errorsMessages[2].field).toEqual("content");
    expect(response.body.errorsMessages[3].field).toEqual("blogId");

    const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`);
    expect(firstPostCreated).toEqual(foundPost.body);
  });
  it("shouldn't update and 401", async () => {
    const data = {
      title: createString(29),
      content: createString(999),
      shortDescription: createString(99),
      blogId: firstBlogCreated.id,
    };

    const { response } = await postsTestManager.updatePost(data, firstPostCreated.id, null, SETTINGS.HTTP_STATUSES.NO_AUTH);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);

    const foundPost = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}`);
    expect(firstPostCreated).toEqual(foundPost.body);
  });
  it("should create 100 posts and return the posts of the second country", async () => {
    for (let i = 0; i < 100; i++) {
      const newPost: PostsCreateModel = {
        title: "p" + i,
        content: "c" + i,
        shortDescription: "s" + i,
        blogId: secondBlogCreated.id,
      };

      await postsTestManager.createPost(newPost, codedAuth);
    }

    const allPosts = await req.get(`${SETTINGS.PATH.POSTS}/?pageNumber=2`);
    expect(allPosts.body.items.length).toEqual(10);
    expect(allPosts.body.page).toEqual(2);
  });
  it("should delete all posts and 204", async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
    const resultPosts = await req.get(`${SETTINGS.PATH.POSTS}`);
    expect(resultPosts.body.items.length).toEqual(0);
  });
  it("should return posts sorted by createdAt desc by default", async () => {
    const newBlog: BlogsCreateModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://some.com",
    };

    const { response, createdEntity } = await blogsTestManager.createBlog(newBlog, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    firstBlogCreated = createdEntity;

    const foundBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}`);
    expect(firstBlogCreated).toEqual(foundBlog.body);
    const newPostCreator = (): PostsCreateModel => {
      const dateTimeString = new Date().getTime().toString();
      return {
        title: `t${dateTimeString}`,
        shortDescription: `sd${dateTimeString}`,
        content: `c${dateTimeString}`,
        blogId: firstBlogCreated.id,
      };
    };

    await postsTestManager.createPost(newPostCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));
    await postsTestManager.createPost(newPostCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));
    await postsTestManager.createPost(newPostCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const resultPosts = await req.get(`${SETTINGS.PATH.POSTS}`);
    const posts = resultPosts.body.items;

    expect(posts.length).toBe(3);
    const dates = posts.map((post: PostsViewModel) => new Date(post.createdAt).toISOString());
    const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    expect(dates).toEqual(sortedDates);
  });
  it("should return posts sorted by createdAt asc when specified", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}?sortBy=createdAt&sortDirection=asc`);

    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);

    const posts = response.body.items;
    expect(posts.length).toBe(3);

    const dates = posts.map((post: PostsViewModel) => new Date(post.createdAt).toISOString());
    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    expect(dates).toEqual(sortedDates);
  });
  it("should return posts sorted by name desc when specified", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}?sortBy=title&sortDirection=desc`);

    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);

    const posts = response.body.items;
    expect(posts.length).toBe(3);

    const titles = posts.map((post: PostsViewModel) => post.title);
    const sortedNames = [...titles].sort((a, b) => b.localeCompare(a));

    expect(titles).toEqual(sortedNames);
  });
  // [ ] should not return the list of comments because there is no post and 404
  it("should not return the list of comments because there is no post and 404", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}/comments`);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  // [ ] shouldn't create a comment on the post and return a 401
  it("shouldn't not create a comment on the post and return a 401", async () => {
    const response = await req.post(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}/comments`);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);
  });
  // shouldn't create a comment on the post and return a 400 (max length 300)
  it("shouldn't not create a comment on the post and return a 400", async () => {
    const userData = {
      login: "login1",
      email: "email1@gmail.com",
      password: "pass1",
    };
    const createUserResult = await usersTestManager.createUser(userData, codedAuth);
    expect(createUserResult.response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);
    expect(createUserResult.createdEntity.login).toBe(userData.login);

    const loginInput = {
      loginOrEmail: "login1",
      email: "email1",
    };

    const accessTokenResult = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(loginInput).expect(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.body).toEqual({
      accessToken: expect.any(String),
    });

    const createCommentData = {
      content: createString(301),
    };

    const result = await postsTestManager.createComment(createCommentData, firstPostCreated.id, accessTokenResult.body.accessToken);

    expect(result.response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(result.response.body).toEqual({
      errorsMessages: [
        {
          message: "Max length for content is 300",
          field: "content",
        },
      ],
    });
  });
  // shouldn't create a comment on the post and return a 400 (min length 20)
  it("shouldn't not create a comment on the post and return a 400", async () => {
    const loginInput = {
      loginOrEmail: "login1",
      email: "email1",
    };

    const accessTokenResult = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(loginInput).expect(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.body).toEqual({
      accessToken: expect.any(String),
    });

    const createCommentData = {
      content: createString(10),
    };

    const result = await postsTestManager.createComment(createCommentData, firstPostCreated.id, accessTokenResult.body.accessToken);

    expect(result.response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(result.response.body).toEqual({
      errorsMessages: [
        {
          message: "Min length for content is 20",
          field: "content",
        },
      ],
    });
  });
  // should create a comment on the post and 201
  it("should create a comment on the post and 201", async () => {
    const loginInput = {
      loginOrEmail: "login1",
      email: "email1",
    };

    const accessTokenResult = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(loginInput).expect(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(accessTokenResult.body).toEqual({
      accessToken: expect.any(String),
    });

    const createCommentData = {
      content: createString(100),
    };

    const result = await postsTestManager.createComment(createCommentData, firstPostCreated.id, accessTokenResult.body.accessToken);
    expect(result.response.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);
    expect(result.response.body).toEqual({
      id: expect.any(String),
      content: createCommentData.content,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: loginInput.loginOrEmail,
      },
      createdAt: expect.any(String),
    });
  });
  // should return all comments by post id and 200
  it("should return all comments by post id and 200", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/${firstPostCreated.id}/comments`);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: expect.any(String),
        },
        createdAt: expect.any(String),
      },
    ]);
  });
});

import { req } from "./test.helpers";
import { SETTINGS } from "../src/settings";
import { BlogDbType } from "../src/db/blog-db-type";
import { BlogsCreateModel } from "../src/features/blogs/models/BlogsCreateModel";
import { blogsTestManager } from "./utils/blogsTestManager";
import { codedAuth, createString } from "./utils/datasets";
import { PostsCreateModel } from "../src/features/posts/models/PostsCreateModel";
import { BlogsViewModel } from "../src/features/blogs/models/BlogsViewModel";

describe(`e2e tests pack for router ${SETTINGS.PATH.BLOGS}`, () => {
  let firstBlogCreated: BlogDbType;
  let secondBlogCreated: BlogDbType;

  beforeAll(async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
  });

  it("should get empty array and 200", async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(SETTINGS.HTTP_STATUSES.OK);

    expect(res.body.items.length).toBe(0);
  });
  it("shouln't find and 404", async () => {
    await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  it("should create", async () => {
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
  it("shouldn't create and 401", async () => {
    const newBlog: BlogsCreateModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const { response } = await blogsTestManager.createBlog(newBlog, null, SETTINGS.HTTP_STATUSES.NO_AUTH);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);

    expect(resultBlogs.body.items.length).toEqual(1);
  });
  it("shouldn't create and 400", async () => {
    const newBlog: BlogsCreateModel = {
      name: createString(16),
      description: createString(501),
      websiteUrl: createString(101),
    };

    const { response } = await blogsTestManager.createBlog(newBlog, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);

    expect(response.body.errorsMessages.length).toEqual(3);

    expect(response.body.errorsMessages[0].field).toEqual("name");
    expect(response.body.errorsMessages[1].field).toEqual("description");
    expect(response.body.errorsMessages[2].field).toEqual("websiteUrl");

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);
    expect(resultBlogs.body.items.length).toEqual(1);
  });
  it("shouldn't del and 401", async () => {
    await req
      .delete(SETTINGS.PATH.BLOGS + "/" + firstBlogCreated.id)
      .set({ Authorization: "Basic " + "xyz" })
      .expect(SETTINGS.HTTP_STATUSES.NO_AUTH);

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);
    expect(resultBlogs.body.items.length).toEqual(1);
  });
  it("should del and 204", async () => {
    await req
      .delete(SETTINGS.PATH.BLOGS + "/" + firstBlogCreated.id)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTP_STATUSES.NO_CONTENT);

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);
    expect(resultBlogs.body.items.length).toEqual(0);
  });
  it("shouldn't del and 404", async () => {
    await req
      .delete(SETTINGS.PATH.BLOGS + "/1")
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  it("should create two entity and 201", async () => {
    const firstNewBlog: BlogsCreateModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://first.some.com",
    };

    let { response: firstResponse, createdEntity: firstCreatedEntity } = await blogsTestManager.createBlog(firstNewBlog, codedAuth);
    expect(firstResponse.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    firstBlogCreated = firstCreatedEntity;

    const foundFirstBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}`);
    expect(firstBlogCreated).toEqual(foundFirstBlog.body);

    const secondNewBlog: BlogsCreateModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://second.some.com",
    };

    let { response: secondResponse, createdEntity: secondCreatedEntity } = await blogsTestManager.createBlog(secondNewBlog, codedAuth);
    expect(secondResponse.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    secondBlogCreated = secondCreatedEntity;

    const foundSecondBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`);
    expect(secondBlogCreated).toEqual(foundSecondBlog.body);
  });
  it("should first update and 204", async () => {
    const data = { name: "n1", description: "d1", websiteUrl: "http://some1.com" };
    const { response } = await blogsTestManager.updateBlog(data, firstBlogCreated.id, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_CONTENT);

    const foundFirstBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}`);
    expect(foundFirstBlog.body.websiteUrl).toEqual(data.websiteUrl);

    firstBlogCreated = foundFirstBlog.body;
  });
  it("should second update and 204", async () => {
    const data = { name: "n2", description: "d2", websiteUrl: "http://some2.com" };
    const { response } = await blogsTestManager.updateBlog(data, secondBlogCreated.id, codedAuth);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_CONTENT);

    const foundSecondBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`);
    expect(foundSecondBlog.body.websiteUrl).toEqual(data.websiteUrl);

    secondBlogCreated = foundSecondBlog.body;
  });
  it("shouldn't update and 404", async () => {
    const data = { name: "n2", description: "d2", websiteUrl: "http://some2.com" };
    const { response } = await blogsTestManager.updateBlog(data, "404", codedAuth, SETTINGS.HTTP_STATUSES.NOT_FOUND);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NOT_FOUND);
  });
  it("shouldn't update and 400", async () => {
    const data = { name: createString(16), description: createString(502), websiteUrl: "xyz://some2.com" };
    const { response } = await blogsTestManager.updateBlog(data, secondBlogCreated.id, codedAuth, SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.BAD_REQUEST);
    expect(response.body.errorsMessages[0].field).toEqual("name");
    expect(response.body.errorsMessages[1].field).toEqual("description");
    expect(response.body.errorsMessages[2].field).toEqual("websiteUrl");

    const foundSecondBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${secondBlogCreated.id}`);
    expect(secondBlogCreated).toEqual(foundSecondBlog.body);
  });
  it("shouldn't update and 401", async () => {
    const data = { name: "n1", description: "d1", websiteUrl: "http://some1.com" };
    const { response } = await blogsTestManager.updateBlog(data, firstBlogCreated.id, null, SETTINGS.HTTP_STATUSES.NO_AUTH);
    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.NO_AUTH);

    const foundFirstBlog = await req.get(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}`);
    expect(firstBlogCreated).toEqual(foundFirstBlog.body);
  });
  it("should get one entity and 200", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}/?searchNameTerm=${firstBlogCreated.name}`);
    expect(resultBlogs.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(resultBlogs.body.items.length).toEqual(1);
    expect(resultBlogs.body.items[0]).toEqual(firstBlogCreated);
  });
  it("should create 100 entities and 200", async () => {
    for (let i = 0; i < 100; i++) {
      const newBlog: BlogsCreateModel = {
        name: `n${i}`,
        description: `d${i}`,
        websiteUrl: `http://some${i}.com`,
      };

      await blogsTestManager.createBlog(newBlog, codedAuth);
    }

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?pageNumber=1&pageSize=10`);
    expect(resultBlogs.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(resultBlogs.body.items.length).toEqual(10);
    expect(resultBlogs.body.totalCount).toEqual(102);
  });
  it("should return second page entities and 200", async () => {
    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?pageNumber=2&pageSize=10`);
    expect(resultBlogs.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(resultBlogs.body.page).toEqual(2);
    expect(resultBlogs.body.items.length).toEqual(10);
    expect(resultBlogs.body.totalCount).toEqual(102);
  });
  it("should create 2 posts in one blog and 201", async () => {
    const newPost1: PostsCreateModel = {
      title: "t1",
      content: "c1",
      shortDescription: "sd1",
      blogId: firstBlogCreated.id,
    };
    const newPost2: PostsCreateModel = {
      title: "t2",
      content: "c2",
      shortDescription: "sd2",
      blogId: firstBlogCreated.id,
    };
    const resultBlogs = await req
      .post(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}/posts`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(newPost1);

    expect(resultBlogs.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    const resultBlogs2 = await req
      .post(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}/posts`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(newPost2);
    expect(resultBlogs2.status).toBe(SETTINGS.HTTP_STATUSES.CREATED);

    const posts = await req.get(`${SETTINGS.PATH.BLOGS}/${firstBlogCreated.id}/posts`);
    expect(posts.status).toBe(SETTINGS.HTTP_STATUSES.OK);
    expect(posts.body.items.length).toEqual(2);
  });
  it("should delete all blogs and 204", async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`);
    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);
    expect(resultBlogs.body.items.length).toEqual(0);
  });
  it("should return blogs sorted by createdAt desc by default", async () => {
    const newBlogCreator = (): BlogsCreateModel => {
      const dateTimeString = new Date().getTime().toString();
      return {
        name: `n${dateTimeString}`,
        description: `d${dateTimeString}`,
        websiteUrl: `http://some${dateTimeString}.com`,
      };
    };

    await blogsTestManager.createBlog(newBlogCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));
    await blogsTestManager.createBlog(newBlogCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));
    await blogsTestManager.createBlog(newBlogCreator(), codedAuth);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const resultBlogs = await req.get(`${SETTINGS.PATH.BLOGS}`);
    const blogs = resultBlogs.body.items;

    expect(blogs.length).toBe(3);
    const dates = blogs.map((blog: BlogsViewModel) => new Date(blog.createdAt).toISOString());
    const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    expect(dates).toEqual(sortedDates);
  });
  it("should return blogs sorted by createdAt asc when specified", async () => {
    const response = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=createdAt&sortDirection=asc`);

    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);

    const blogs = response.body.items;
    expect(blogs.length).toBe(3);

    const dates = blogs.map((blog: BlogsViewModel) => new Date(blog.createdAt).toISOString());
    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    expect(dates).toEqual(sortedDates);
  });
  it("should return blogs sorted by name desc when specified", async () => {
    const response = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=name&sortDirection=desc`);

    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);

    const blogs = response.body.items;
    expect(blogs.length).toBe(3);

    const names = blogs.map((blog: BlogsViewModel) => blog.name);
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));

    expect(names).toEqual(sortedNames);
  });
  it("should return blogs sorted by createdAt desc when specified", async () => {
    const response = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=createdAt&sortDirection=desc`);

    expect(response.status).toBe(SETTINGS.HTTP_STATUSES.OK);

    const blogs = response.body.items;
    expect(blogs.length).toBe(3);

    const dates = blogs.map((blog: BlogsViewModel) => new Date(blog.createdAt).toISOString());
    const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    expect(dates).toEqual(sortedDates);
  });
});

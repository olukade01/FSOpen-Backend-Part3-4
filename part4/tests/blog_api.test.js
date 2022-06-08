const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const Blog = require("../model/blog");
const { blogsInDB, initialBlogs, usersInDB } = require("./test_helper");
const User = require("../model/user");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
  // const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("Id property of a blog is named id", async () => {
    const response = await blogsInDB();
    const id = response[0].id;
    expect(id).toBeDefined();
  });
});

describe("addition of a new blog", () => {
  test("a valid blog is created", async () => {
    const resp = await api
      .post("/api/login")
      .send({ username: "olukade", password: "adebayo" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    console.log(resp);
    const blog = {
      title: "creating a new blog",
      author: "muhammad",
      url: "no ask me",
      likes: 4,
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .set("Authorization", resp.body.token);
    const response = await blogsInDB();
    expect(response).toHaveLength(initialBlogs.length + 1);
    const title = response.map((r) => r.title);
    expect(title).toContain("creating a new blog");
  }, 20000);

  test("likes property of blog will return zero if missing", async () => {
    const blog = {
      title: "creating a new blog",
      url: "no ask me",
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await blogsInDB();
    expect(response[2].likes).toBe(0);
  });

  test("blog is not created if title and url are missing", async () => {
    const blog = {
      author: "muhammad",
      likes: 3,
    };
    await api.post("/api/blogs").send(blog).expect(400);
    const response = await blogsInDB();
    expect(response).toHaveLength(initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await blogsInDB();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogAfterDelete = await blogsInDB();
    expect(blogAfterDelete).toHaveLength(blogsAtStart.length - 1);
    const title = blogAfterDelete.map((blog) => blog.title);
    expect(title).not.toContain(blogToDelete.title);
  });
});

describe("updating a blog", () => {
  test("updating a blog post", async () => {
    const blogsAtStart = await blogsInDB();
    const blogToUpdate = blogsAtStart[0];
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await blogsInDB();
    const likes = blogsAtEnd[0].likes;
    expect(likes).toBe(blogToUpdate.likes + 1);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "olukade", passwordHash });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const initialUser = await usersInDB();
    const user = {
      username: "adebayo",
      name: "muhammad",
      password: "dolapo",
    };
    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const userAtEnd = await usersInDB();
    expect(userAtEnd).toHaveLength(initialUser.length + 1);
    const username = userAtEnd.map((name) => name.username);
    expect(username).toContain(user.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const initialUser = await usersInDB();
    const user = {
      username: "olukade",
      name: "muhammad",
      password: "dolapo",
    };
    const result = await api
      .post("/api/users")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const userAtEnd = await usersInDB();
    expect(userAtEnd).toHaveLength(initialUser.length);
    expect(userAtEnd).toEqual(initialUser);
    expect(result.body.error).toContain("username must be unique");
  });

  test("creation fails with proper statuscode and message if password length is less than three", async () => {
    const initialUser = await usersInDB();
    const user = {
      username: "olukade01",
      name: "muhammad",
      password: "do",
    };
    const result = await api
      .post("/api/users")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const userAtEnd = await usersInDB();
    expect(userAtEnd).toHaveLength(initialUser.length);
    expect(userAtEnd).toEqual(initialUser);
    expect(result.body.error).toContain("min length of password must be 3");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

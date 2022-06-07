require("dotenv").config();
const blogRouter = require("express").Router();
const Blog = require("../model/blog");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog ? response.json(blog) : response.status(404).end();
});

blogRouter.get("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog ? response.json(blog.comments) : response.status(404).end();
});

blogRouter.post('/:id/comments', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog);
  const {comment} = req.body
  blog.comments = blog.comments.concat(comment)
  await blog.save()
  res.status(201).json(blog)
})

blogRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  };

  const newBlog = new Blog({ ...blog, likes: !blog.likes ? 0 : blog.likes });

  const result = await newBlog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  // const body = request.body;
  // const newBlog = {
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes,
  //   user: body.user,
  // };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: blog.likes + 1 },
    { new: true, runValidators: true, context: "query" }
  );
  return response.json(updatedBlog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;
  const userid = user._id;
  if (blog.user.toString() === userid.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    return response.status(204).end();
  }
  response.status(400).json({ error: "wrong user" });
});

module.exports = blogRouter;

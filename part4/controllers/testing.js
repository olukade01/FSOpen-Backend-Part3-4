const router = require("express").Router();
const Blog = require("../model/blog");
const User = require("../model/user");

router.post("/reset", async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = router;

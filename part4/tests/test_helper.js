const Blog = require("../model/blog");
const User = require("../model/user");

const initialBlogs = [
  {
    title: "testing testing",
    author: "olukade",
    url: "no prejure me",
    likes: 1,
  },
  {
    title: "its already working",
    author: "adebayo",
    url: "ani no ask me shii",
    likes: 3,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const user = await User.find({})
  return user.map(u => u.toJSON())
}

module.exports = {initialBlogs, blogsInDB, usersInDB}
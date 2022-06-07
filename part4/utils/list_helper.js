const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (acc, curr) => {
    return acc + curr.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

  // ways of getting max figure in [] of {} 

  // return Math.max(...blogs.map(blog => blog.likes))
  // return Math.max.apply(null, blogs.map(item => item.likes))
  // return blogs.reduce((maxId, item) => Math.max(maxId, item.likes), 0);

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, cur) => max.likes > cur.likes ? max ={
    title: max.title,
    author: max.author,
    likes: max.likes
  } : cur)
}

const mostBlogs = (blogs) => {
  const highBlog = {};
  blogs.forEach((blog) => {
    highBlog[blog.author]
      ? (highBlog[blog.author] += 1)
      : (highBlog[blog.author] = 1);
  });
  return Object.entries(highBlog)
    .map((blog) => ({ author: blog[0], blogs: blog[1] }))
    .sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = (blogs) => {
  const highestLikes = {};
  blogs.forEach((blog) => {
    highestLikes[blog.author]
      ? (highestLikes[blog.author] += blog.likes)
      : (highestLikes[blog.author] = blog.likes);
  });
  return Object.entries(highestLikes)
    .map((blog) => ({ author: blog[0], likes: blog[1] }))
    .sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
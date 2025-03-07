const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "John Doe",
    url: "http://example.com",
    likes: 5,
  },
  {
    title: "JavaScript is powerful",
    author: "Jane Doe",
    url: "http://example.com/js",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "temporary blog",
    author: "test",
    url: "http://example.com",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};

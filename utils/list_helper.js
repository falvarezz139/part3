// utils/list_helper.js

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null; // Si la lista está vacía devolvemos null
  }

  return blogs.reduce((maxBlog, currentBlog) => {
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
  });
};

module.exports = {
  favoriteBlog,
};

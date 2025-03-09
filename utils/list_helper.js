const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current));
};

module.exports = {
  favoriteBlog,
};

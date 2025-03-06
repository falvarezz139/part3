const assert = require("assert");
const listHelper = require("../utils/list_helper");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "1",
    title: "Blog 1",
    author: "Author 1",
    url: "http://example.com",
    likes: 3,
  },
  {
    _id: "2",
    title: "Blog 2",
    author: "Author 2",
    url: "http://example.com",
    likes: 4,
  },
  {
    _id: "3",
    title: "Blog 3",
    author: "Author 3",
    url: "http://example.com",
    likes: 5,
  },
];

const listWithMultipleBlogsWithSameLikes = [
  {
    _id: "1",
    title: "Blog 1",
    author: "Author 1",
    url: "http://example.com",
    likes: 5,
  },
  {
    _id: "2",
    title: "Blog 2",
    author: "Author 2",
    url: "http://example.com",
    likes: 5,
  },
  {
    _id: "3",
    title: "Blog 3",
    author: "Author 3",
    url: "http://example.com",
    likes: 5,
  },
];

const result1 = listHelper.favoriteBlog(listWithOneBlog);
assert.deepStrictEqual(
  result1,
  listWithOneBlog[0],
  "Debe devolver el único blog en la lista"
);

const result2 = listHelper.favoriteBlog(listWithMultipleBlogs);
assert.deepStrictEqual(
  result2,
  listWithMultipleBlogs[2],
  "Debe devolver el blog con más likes"
);

//Cuando la lista tiene varios blogs con el mismo número de likes debe devolver alguno
const result3 = listHelper.favoriteBlog(listWithMultipleBlogsWithSameLikes);
const validBlogs = listWithMultipleBlogsWithSameLikes.filter(
  (blog) => blog.likes === 5
);
assert.ok(
  validBlogs.includes(result3),
  "Debe devolver uno de los blogs con 5 likes"
);

//Cuando la lista está vacía devuelve null
const result4 = listHelper.favoriteBlog([]);
assert.strictEqual(
  result4,
  null,
  "Debe devolver null cuando la lista está vacía"
);

console.log("Todas las pruebas pasaron!");

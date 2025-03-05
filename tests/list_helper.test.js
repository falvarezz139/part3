// tests/list_helper_test.js
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

// Test para la función totalLikes
const result1 = listHelper.totalLikes(listWithOneBlog);
assert.strictEqual(
  result1,
  5,
  "Total likes should be 5 when there is only one blog"
);

const result2 = listHelper.totalLikes([
  { likes: 3 },
  { likes: 4 },
  { likes: 5 },
]);
assert.strictEqual(
  result2,
  12,
  "Total likes should be 12 when there are multiple blogs"
);

const result3 = listHelper.totalLikes([]);
assert.strictEqual(
  result3,
  0,
  "Total likes should be 0 when the list is empty"
);

console.log("All tests passed!");

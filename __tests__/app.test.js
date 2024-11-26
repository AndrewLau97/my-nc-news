const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

/* Set up your beforeEach & afterAll functions here */

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of objects containing the information ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(topics[0]).toMatchObject({
          slug: "mitch",
          description: "The man, the Mitch, the legend",
        });
      });
  });
});

describe("Wrong URL", () => {
  test("404: Responds with Not Found when requesting from an incorrect URL", () => {
    return request(app)
      .get("/api/topc")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of the given article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9001")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: Responds with an array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with the array with the most recent comments first",()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body:{comments}})=>{
      expect(comments).toBeSortedBy('created_at',{descending:true})
    })
  })
  test("404: Article_id does not exist",()=>{
    return request(app)
    .get("/api/articles/9001/comments")
    .expect(404)
    .then(({body:{message}})=>{
      expect(message).toBe("Not Found")
    })
  })
  test("400: Article_id is not a number",()=>{
    return request(app)
    .get("/api/articles/not-a-number/comments")
    .expect(400)
    .then(({body:{message}})=>{
      expect(message).toBe("Bad request")
    })
  })
});

describe("POST /api/articles/:article_id/comments",()=>{
  test("201: Post comment onto an article and respond with the posted comment",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username:"lurker",
      body:"test comment body"
    })
    .expect(201)
    .then(({body:{comment}})=>{
      expect(comment).toEqual({
        article_id:1,
        votes:0,
        created_at:expect.any(String),
        comment_id:expect.any(Number),
        author:"lurker",
        body:"test comment body"
      })
    })
  });
  test("404: Article_id does not exist",()=>{
    return request(app)
    .post("/api/articles/9001/comments")
    .send({
      username:"lurker",
      body:"test comment body"
    })
    .expect(404)
    .then(({body:{message}})=>{
      expect(message).toBe("Article Id does not exist")
    })
  })
  test("400: Article_id is not a number",()=>{
    return request(app)
    .post("/api/articles/not-a-number/comments")
    .send({
      username:"lurker",
      body:"test comment body"
    })
    .expect(400)
    .then(({body:{message}})=>{
      expect(message).toBe("Bad request")
    })
  })
  test("400: Invalid user",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username:"lurk",
      body:"test comment body"
    })
    .expect(401)
    .then(({body:{message}})=>{
      expect(message).toBe("Invalid user, please create an account")
    })
  })
  test("400: Missing Information",()=>{
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username:"lurker"
    })
    .expect(400)
    .then(({body:{message}})=>{
      expect(message).toBe("Missing information")
    })
  })
  test("400:Multiple errors",()=>{
    return request(app)
    .post("/api/articles/9001/comments")
    .send({username:"lurk"})
    .expect(400)
    .then(({body:{message}})=>{
      expect(message).toBe("Missing information")
    })
  })
})
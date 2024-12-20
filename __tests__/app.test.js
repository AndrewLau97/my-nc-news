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

describe("POST /api/topics", () => {
  test("201: Post body to topics, and responds with the newly added topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "test-topic",
        description: "to test",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "test-topic",
          description: "to test",
        });
      });
  });
  test("201: Post body, even when description is missing", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "test-topic",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toEqual({
          slug: "test-topic",
          description: null,
        });
      });
  });
  test("400: Slug already exists", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "mitch",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Topic already exists");
      });
  });
  test("400: Slug key is missing from body", () => {
    return request(app)
      .post("/api/topics")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Missing information");
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
  test("200: Returned Object should now include a comment_count property of the total count of all comments with the article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe("11");
      });
  });
  test("200: Comment count should be 0 if no comments on article id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe("0");
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: Patch votes of a given article_id with a positive number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Patch votes of a given article_id with a negative number, does not go below 0", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -101,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9001")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({
        inc_votes: 1,
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: No information sent", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe(
          "Invalid information given, please check information is correct"
        );
      });
  });
  test("400: Incorrect key-name in object given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votez: 1 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe(
          "Invalid information given, please check information is correct"
        );
      });
  });
  test("400: Value of new votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe(
          "Invalid information given, please check information is correct"
        );
      });
  });
});

describe("DELETE /api/articles/:article_id",()=>{
  test("204: delete an article based on given id and all its respective comments",()=>{
    return request(app)
    .delete("/api/articles/6")
    .expect(204)
  })
  test("404: article id does not exist",()=>{
    return request(app)
    .delete("/api/articles/9001")
    .expect(404)
    .then(({body:{message}})=>{
      expect(message).toBe("Not Found")
    })
  })
  test("400: article id is not a number",()=>{
    return request(app)
    .delete("/api/articles/not-a-number")
    .expect(400)
    .then(({body:{message}})=>{
      expect(message).toBe("Bad request")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(total_count).toBe(13);
        expect(articles).toHaveLength(10);
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
          expect(article).toHaveProperty("comment_count");
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
  test("200: Takes in order query, responds with an array of article objects sorted by date in ascending order when order query is asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("200: Takes in order query, responds with an array of article objects sorted by date in ascending order when order query is desc", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Takes in order query - case insensitive", () => {
    return request(app)
      .get("/api/articles?order=DESC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Takes in sort_by query, responds with an array of article objects sorted by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("200: Takes in sort_by query case-insensitive, responds with an array of article objects sorted by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=CREATED_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Takes in sort_by query and order query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });
  test("200: Takes in topic query, responds with an array of articles filtered by topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(total_count).toBe(12);
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with empty array when no articles of given topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
      });
  });
  test("200: Takes in topic query, responds with all articles if topic is omitted", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(total_count).toBe(13);
        expect(articles).toHaveLength(10);
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
        });
      });
  });
  test("200: Takes in sort_by,order and topic query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc&topic=mitch")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(total_count).toBe(12);
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });
  test("200: Takes in limit query, limits the response given by limit amount", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(5);
      });
  });
  test("200: No limit query given - default limit response to 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
      });
  });
  test("200: P query denoting the page to start at", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(3);
      });
  });
  test("200: If P query goes past pages amount after limits, should respond with the last P query that had responses", () => {
    return request(app)
      .get("/api/articles?p=9001")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(3);
      });
  });
  test("200: No P query, defaults P to 1", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
      });
  });
  test("200: Contains Limit, P and sort by query", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2&sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(5);
        let count = 8;
        articles.forEach((article) => {
          expect(article.article_id).toBe(count);
          count--;
        });
      });
  });
  test("200: Responds with a total count property that displays total number of articles", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles).toHaveLength(5);
        expect(total_count).toBe(13);
      });
  });
  test("200: Responds with a total count property that displays total number of articles after being filtered", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2&topic=mitch")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles).toHaveLength(5);
        expect(total_count).toBe(12);
      });
  });
  test("400: P query cannot be less than 1", () => {
    return request(app)
      .get("/api/articles?p=0")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: P query is not a number", () => {
    return request(app)
      .get("/api/articles?p=not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Limit query is not a number", () => {
    return request(app)
      .get("/api/articles?limit=not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Limit query is 0 or less", () => {
    return request(app)
      .get("/api/articles?limit=0")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Order query is not valid - regex testing", () => {
    return request(app)
      .get("/api/articles?order=descending")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Order query is not valid ", () => {
    return request(app)
      .get("/api/articles?order=not-valid")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Sort_by query is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=created")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404:Topic query does not exist", () => {
    return request(app)
      .get("/api/articles?topic=dog")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

describe("POST /api/articles", () => {
  test("200: POSTs given information into articles and returns information regarding the article, includiing created_at, votes, article_id and comment_count", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "test title",
        body: "test body",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "test title",
          body: "test body",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test("200: If no article_url is given, default img should be inserted", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "test title",
        body: "test body",
        topic: "mitch",
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });
  test("404: Author is not a valid user", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "fake_butter_bridge",
        title: "test title",
        body: "test body",
        topic: "mitch",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid user, please create an account");
      });
  });
  test("404: Topic does not exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "test title",
        body: "test body",
        topic: "not-a-topic",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Topic does not exist");
      });
  });
  test("400: Missing Information - no title", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        body: "test body",
        topic: "not-a-topic",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Missing information");
      });
  });
  test("400: Missing Information - no body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "test title",
        topic: "not-a-topic",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Missing information");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("200: Responds with the array with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200:Responds with empty array as no comments for given Article_id", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("200: Takes in Limit query which limits number of responses", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(5);
      });
  });
  test("200: If no limit, default limit is 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(10);
      });
  });
  test("200: Takes in a P (page) query which specifies the page at which to start at", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(1);
      });
  });
  test("200: If no P (page) given, default page is set to 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(10);
      });
  });
  test("200: Contains Limit and P query, returns given page, by limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(5);
        expect(comments[0].article_id).toBe(1);
      });
  });
  test("400: P query is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: P query is less than 1", () => {
    return request(app)
      .get("/api/articles/1/comments?p=0")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Limit query is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Limit query is less than 1", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: Article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9001/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Post comment onto an article and respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "test comment body",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
          author: "lurker",
          body: "test comment body",
        });
      });
  });
  test("404: Article_id does not exist", () => {
    return request(app)
      .post("/api/articles/9001/comments")
      .send({
        username: "lurker",
        body: "test comment body",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article Id does not exist");
      });
  });
  test("400: Article_id is not a number", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({
        username: "lurker",
        body: "test comment body",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: Invalid user", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurk",
        body: "test comment body",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid user, please create an account");
      });
  });
  test("400: Missing Information", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Missing information");
      });
  });
  test("400:Multiple errors", () => {
    return request(app)
      .post("/api/articles/9001/comments")
      .send({ username: "lurk" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Missing information");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Delete comment of given comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9001")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Patch votes of comment by given comment id with a postive value", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 4 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 20,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("200: Patch votes of comment by given comment id with a negative value, does not go below 0", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -17 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 0,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("404: Comment id does not exist", () => {
    return request(app)
      .patch("/api/comments/9001")
      .send({ inc_votes: 4 })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Comment id is not a number", () => {
    return request(app)
      .patch("/api/comments/not-a-number")
      .send({ inc_votes: 4 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: No information given", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Wrong key-name given in body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: 4 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Body value is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "fifty" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/users/:username", () => {
  test("200: Responds with the user object of the given username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });
  test("404: Username does not exist", () => {
    return request(app)
      .get("/api/users/wrongUsername")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

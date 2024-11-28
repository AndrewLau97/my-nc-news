## About The Project

NC News API - https://my-nc-news-js63.onrender.com/


This is an API for the purpose of accessing application data programmatically, with the purpose to provide this information to the front end,
Database will be with PostgreSQL and will be interacted using node-postgres.
endpoints.json contains information regarding the endpoints for this API, with examples of what the endpoint responds with.


## Getting Started

To clone, click code and copy the WEB URL(HTTPS). Then in your terminal where you would like the repo run command
git clone "WEB URL"

Change directory to the repo and then run npm install to install all dependencies needed for the repo.

In the root file, create a .env.test file containing PGDATABASE=nc_news_test
and another file called .env.development containing PGDATABASE=nc_news
Then set up your databases with the command code npm run setup-dbs

Tests are run using jest, and the command line to run tests is npm test.
npm test app.test.js will just test the app.js file,
while npm test utils.test.js, will test the utils functions for creating the seed in seed.js


### Prerequisites

Version 22.9.0 of Node.js is 

Version 16.4 Postgre is required


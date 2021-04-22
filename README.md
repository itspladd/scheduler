# Interview Scheduler

A single-page interview-scheduling application made with React! Built as part of my education at Lighthouse Labs to teach me the basics of a React project.

## Tech Stack
React with Webpack and Babel for front-end
Axios and WebSocket to communicate with server
Storybook, Jest, and Cypress for testing

## Dependencies
Tested with Node v. 10.16.1. May not function properly on other Node versions.

Relies on a local PG database and API, which you can find here: https://github.com/itspladd/scheduler-api

Testing with Cypress requires a global Cypress install (`npm install -g cypress`).

## Local Setup

1. Install dependencies with `npm install`.
2. Run the Webpack Dev Server with `npm start`.

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress Testing

You'll need a local PG test database with access credentials stored in an `.env.test` file in the root of `scheduler-api`.

1. Seed the test database with the `create.sql` and `test.sql` files in the `scheduler-api/src/db/schema` folder.
2. Run `scheduler-api` in test mode according to its documentation.
3. Run the tests with `npm run cypress` from the `scheduler` directory.

## Features

### Responsive UI in a Single Page
View, book, and cancel interview appointments!
![](https://github.com/itspladd/scheduler/blob/main/docs/interface.gif)
*As long as EVERYONE uses this application for their bookings, all is well.*

### Live Updates with Websocket
No need to refresh the page to see someone else's bookings - the pages stay in sync automatically!
![](https://github.com/itspladd/scheduler/blob/main/docs/websocket.gif)
*Just don't look at the Github Issues page for this projet. Ignore it. There are no bugs in Ba Sing Se.*

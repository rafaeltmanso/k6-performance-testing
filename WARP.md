# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install dependencies
  ```bash path=null start=null
  cd api
  npm install
  ```
- Run the API in development (with nodemon)
  ```bash path=null start=null
  npm run dev
  ```
- Run the API in production mode
  ```bash path=null start=null
  npm start
  ```
- Environment setup (variables read from `api/src/.env`)
  ```dotenv path=null start=null
  # create api/src/.env
  MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
  # optional
  TIMEOUT=2000
  PORT=3333
  ```

Notes
- No lint or test scripts are defined in `api/package.json`.
- Default port is 3333 if `PORT` is not set.

## High-level architecture

- Service: `api/` is a Node.js + Express HTTP API.
  - Entry point: `api/src/server.js`
    - Loads environment variables from `api/src/.env`.
    - Connects to MongoDB via Mongoose using `process.env.MONGO_URL`.
    - Sets up middleware: `cors()`, `express.json()`, Celebrate error handler.
    - Registers routes from `api/src/routes.js`.
    - Exposes health/info at `GET /`.
  - Routing and validation: `api/src/routes.js`
    - Defines `POST /signup` with Celebrate/Joi validation for request body.
      - `email`: required, valid email
      - `password`: required string
  - Controller: `api/src/controllers/UserController.js`
    - `store(req, res)`: creates a user with `email` and `md5(password)` and returns `201` with `{ _id, email }`.
    - If `process.env.TIMEOUT` is set, the response is delayed by that many milliseconds.
    - On duplicate email, returns `400` with `{ error: 'Duplicate email' }`.
  - Data model: `api/src/models/User.js`
    - `User` Mongoose model with schema `{ email (unique), password }`, `versionKey: false`.
- Tests: `tests/` exists as a placeholder; no test files or runner configured.

## API quick reference

- `GET /` → returns basic app metadata.
- `POST /signup` → body `{ email, password }`; creates user and returns `201` with `{ _id, email }`.

## Operational considerations

- MongoDB: provide a valid `MONGO_URL` (local or hosted). Avoid committing real credentials.
- Port: set `PORT` to change the listening port; otherwise defaults to `3333`.

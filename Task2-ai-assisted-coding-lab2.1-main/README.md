# Task 2.1: Book Rating API

You are building the backend for a book rating service, using Express and MongoDB (Mongoose) only, with no frontend. Anyone can browse and submit book ratings, and there is no login for this resource.

## What's already done for you

- `server/src/index.js`, `server/src/app.js`, `server/src/config/db.js` —
  app bootstrap and DB connection. The `/api/ratings` router is already
  mounted in `app.js`.
- `server/src/models/User.js` — a plain user schema (`name`, `email`,
  `password`). It's not tied to any login flow here; it exists so
  `Rating.ratedBy` has something to reference.
- `server/src/controllers/userController.js` + `server/src/routes/users.js`
  — full CRUD over users, already wired, as a worked example of what your
  `ratingController.js` should look like structurally (validation → DB
  call → response, one function per route).

## Run locally

```
cd server
npm install
# create server/.env (see "Database connection" below)
npm run dev
npm test
```

`npm test` uses the same `MONGO_URI` from your `.env`. Each test run creates
its own temporary database on that cluster and deletes it when it finishes,
so it never touches the data you use with `npm run dev`.

## Database connection

There is no `.env` provided. Create `server/.env` yourself (it's
git-ignored) with:

```
PORT=4000
MONGO_URI=mongodb://tasks:pass1234@ac-j3acrgb-shard-00-00.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-01.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-02.lueesfz.mongodb.net:27017/?ssl=true&replicaSet=atlas-6to6iy-shard-0&authSource=admin&appName=Cluster0
```

## What you need to build

All of your work goes in three files: `server/src/models/Rating.js`,
`server/src/controllers/ratingController.js` and
`server/src/routes/ratings.js`.

### 1. The `Rating` model — `server/src/models/Rating.js`

| field | type | rules |
|---|---|---|
| `bookCode` | String | required (e.g. `"BK101"`) |
| `rating` | Number | required, `min: 1`, `max: 5` |
| `note` | String | optional |
| `ratedBy` | ObjectId ref `User` | optional |

Keep `{ timestamps: true }` and add a **compound unique index** on
`{ bookCode: 1, ratedBy: 1 }`.

### 2. Controller + routes

Implement these three controller functions and wire them in
`server/src/routes/ratings.js`:

| method | path | function | success response |
|---|---|---|---|
| POST | `/api/ratings` | `createRating` | `201` `{ rating: <document> }` |
| GET | `/api/ratings` | `getAllRatings` | `200` `{ ratings: [...] }` |
| GET | `/api/ratings/:id` | `getRating` | `200` `{ rating: <document> }` |

- For `GET /api/ratings/:id` on a valid id that does not exist, respond
  `404` with `{ message: 'Rating not found' }`.
- Pass unexpected errors to `next(err)`, as the User controller does.

### 3. The summary endpoint

Implement `getRatingSummary` and wire it as
`GET /api/ratings/summary?bookCode=BK101`. It returns:

```
{ "bookCode": "BK101", "averageRating": <number>, "ratingCount": <integer> }
```

- Compute it with `Rating.aggregate()`: `$match` on `bookCode`, then
  `$group` with `$avg` of `rating` and `$sum: 1`. Loading documents
  with `find()` and averaging in JavaScript does not count.
- If nothing matches, return the requested `bookCode` with
  `averageRating: 0` and `ratingCount: 0`.
- If the `bookCode` query parameter is missing, respond `400` with
  `{ message: 'bookCode is required' }`.
- `/summary` must be reachable and must not be handled by `/:id`.

## Submission

1. Fork this repository and do all of your work in your fork.
2. Commit and push to your fork.
3. Open a pull request from your fork to `main` of this repository.
4. Fill in the pull request description using the provided template: the
   submission line must be your identifier in the format `XX-XXXXX TXX`.

## AI use

You're expected to use AI tools while building this. You remain
responsible for all of the code you submit.

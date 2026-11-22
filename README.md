# All-Auth

All-Auth is a small full-stack authentication project built from scratch.

It demonstrates how a web application can register users, log them in, protect routes, refresh expired access tokens, and log users out. The project is intentionally simple, but it uses the same core ideas found in production authentication systems:

- React with Vite on the client
- Express and Node.js on the server
- PostgreSQL for persistence
- bcrypt for password and refresh-token hashing
- JSON Web Tokens for authentication
- HTTP-only cookies for storing tokens

The main goal is educational: to make the mechanics of authentication visible and understandable.

## Project structure

The repository contains two applications:

```text
client/   React frontend
server/   Express API and PostgreSQL integration
```

The client renders the authentication screens and protects frontend routes. The server handles users, passwords, tokens, cookies, and database access.

## Authentication flow

### Registration

A user registers through:

```http
POST /api/auth/register
```

The server validates the input, checks whether the username is available, hashes the password with bcrypt, and stores the user in PostgreSQL. It then creates an access token and a refresh token, stores a hash of the refresh token, and sends both tokens as HTTP-only cookies.

Passwords are never stored in their original form.

### Login

Users sign in through:

```http
POST /api/auth/login
```

The server looks up the user and compares the submitted password with the stored bcrypt hash. If the credentials are valid, it creates and sends a new pair of tokens as cookies.

Invalid usernames and passwords return the same generic error message, avoiding an easy way to discover which usernames exist.

### Access tokens

The access token is a short-lived JWT that expires after 15 minutes. It is used for quick authentication checks while the user is using the application. The server can validate it with the access-token secret without querying the database.

A short lifetime limits the impact of an exposed access token.

### Refresh tokens

The refresh token lasts for 7 days and is stored in an HTTP-only cookie. Its hash is also stored in PostgreSQL, which allows the server to revoke it and verify that it has not been replaced.

When the access token expires, the client calls:

```http
GET /api/auth/authenticate
```

The server validates the refresh token, compares it with the stored hash, rotates the refresh token, and sends a new access token and refresh token to the client. This keeps the user signed in without making the access token long-lived.

## Client-side route protection

The React application wraps its routes with `AuthProvider`. It exposes an authentication state with three possible values:

- `undefined` while authentication is being checked
- `true` when the user is authenticated
- `false` when authentication fails

`ProtectedRoute` uses this state to control access to the dashboard:

- While the state is `undefined`, it displays a loading screen.
- When the user is authenticated, it renders the protected page.
- When authentication fails, it redirects the user to `/register`.

The frontend routes are:

```text
/register   Create an account
/login      Sign in
/          Protected dashboard
/loading    Loading state
```

## Logout

Users log out through:

```http
POST /api/auth/logout
```

The server verifies the refresh token, removes its database entry, and clears both authentication cookies. The user must sign in again before accessing the dashboard.

## Database

The database currently contains two tables.

### `users`

Stores:

- `id`
- `username`
- `password_hash`
- `created_at`

### `refresh_tkn`

Stores:

- `id`
- `user_id`
- `tkn_hash`
- `created_at`
- `expires_at`

The refresh-token table associates each token with a user. Refresh-token values are hashed before being stored, just like passwords.

The schema is in `server/src/db/schema.sql`.

## API endpoints

All authentication endpoints are mounted under `/api/auth`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/auth/authenticate` | Check or refresh authentication |
| `POST` | `/api/auth/logout` | Revoke the refresh token and clear cookies |

The server also provides two basic health-check endpoints:

```http
GET /
GET /test-db
```

The first confirms that the API is running. The second checks whether the server can query PostgreSQL.

## Running locally

### Requirements

- Node.js
- PostgreSQL
- A PostgreSQL database for the project

### Configure the server

Create a `.env` file in `server/`:

```env
PORT=3000

DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_ACCESS_SECRET=replace_with_a_long_random_value
JWT_REFRESH_SECRET=replace_with_another_long_random_value

ORIGIN=http://localhost:5173
```

Apply the schema to your database:

```bash
psql "$DATABASE_URL" -f server/src/db/schema.sql
```

You can also run the SQL in `server/src/db/schema.sql` with your preferred PostgreSQL client.

### Install dependencies

```bash
npm install --prefix client
npm install --prefix server
```

### Start the server

```bash
cd server
npm run dev
```

The API runs on `http://localhost:3000` by default.

### Start the client

In another terminal:

```bash
cd client
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

If the API uses a different URL, create `client/.env` with:

```env
VITE_API_URL=http://localhost:3000
```

## Security notes

This is a learning project, not a production-ready identity system. Before deploying it, the following areas would need additional work:

- Enable `secure: true` for cookies over HTTPS.
- Review `sameSite` and cross-origin settings for the deployment.
- Add stronger input validation.
- Add database migrations and foreign-key constraints.
- Handle refresh-token expiry explicitly.
- Add rate limiting and account lockout protections.
- Add automated tests, monitoring, and more consistent error handling.

The project’s core lesson is the relationship between the pieces: passwords are hashed, access tokens expire quickly, refresh tokens can be revoked, and protected routes depend on a server-side authentication check.

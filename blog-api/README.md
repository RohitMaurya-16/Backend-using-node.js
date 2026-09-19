# JWT Authentication Blog API

This project is a learning-focused full-stack blog application with a separate backend and frontend. The backend is a REST API built with Express.js, Prisma ORM, and PostgreSQL. JWT authentication is implemented directly with `jsonwebtoken` and `bcryptjs`.

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (local only)
- jsonwebtoken
- bcryptjs
- CORS
- dotenv
- React + Vite frontend

## Local PostgreSQL Setup

### 1. Install PostgreSQL locally

1. Download PostgreSQL from the official PostgreSQL website.
2. Install it on your laptop.
3. During installation, set a password for the default `postgres` user.
4. Make sure the PostgreSQL service is running.

### 2. Create the database

Open the PostgreSQL shell or psql and run:

```bash
psql -U postgres
CREATE DATABASE blog_db;
\q
```

### 3. Configure the username/password

Use the PostgreSQL credentials on your laptop. An example connection string is:

```env
DATABASE_URL="postgresql://postgres:Zoology@07@localhost:5432/blog_db"
```

### 4. Put it in .env

Create a `.env` file in the `blog-api` folder using the example below:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db"
JWT_SECRET="your-long-random-secret"
CLIENT_URL="http://localhost:5173"
```

### 5. Run Prisma migrations

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

This creates the database tables and generates the Prisma client.

### 6. Run Prisma Studio

```bash
npx prisma studio
```

This opens Prisma Studio in the browser so you can inspect the local database.

### 7. Reset the local database

When starting over locally:

```bash
dropdb -U postgres blog_db
createdb -U postgres blog_db
npx prisma migrate reset
```

You can also delete migration records if needed, but for a local learning app, `prisma migrate reset` is the usual reset command.

## Authentication and JWT Flow

### Authentication vs Authorization

- Authentication = Who are you?
- Authorization = What are you allowed to do?

For example, a valid JWT proves you are signed in, but the app still checks the user role before allowing a protected action such as creating a post.

### JWT Learning Flow

```text
React Frontend
   │
   │ POST /api/auth/login
   │ username + password
   ▼
Express Backend
   │
   │ verify credentials
   ▼
JWT generated
   │
   │ token
   ▼
React Frontend
   │
   │ localStorage.setItem("token", response.token)
   ▼
localStorage
```

Then the frontend sends the token in the Authorization header:

```js
const token = localStorage.getItem('token');

fetch(`${API_URL}/api/auth/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### What Authorization, Bearer, and JWT mean

- Authorization: HTTP header used to send credentials.
- Bearer: authentication scheme saying the token is in the header.
- JWT: signed token the backend verifies.

The frontend stores the JWT in localStorage for this learning project because it is a simple way to observe the request/response flow. This has XSS-related tradeoffs, but it keeps the project easy to understand.

## JWT Expiration

This project deliberately uses a 2-minute expiration.

```js
jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '2m',
});
```

After 2 minutes, the token expires and the backend returns:

```json
{
  "error": "Token expired",
  "message": "Please login again"
}
```

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | None | Register a user |
| POST | /api/auth/login | None | Login and receive JWT |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/posts | None | View published posts |
| GET | /api/posts/:id | None | View published post |
| POST | /api/posts | JWT + AUTHOR | Create post |
| PUT | /api/posts/:id | JWT + AUTHOR | Update post |
| DELETE | /api/posts/:id | JWT + AUTHOR | Delete post |
| PATCH | /api/posts/:id/publish | JWT + AUTHOR | Publish/unpublish post |
| GET | /api/posts/:postId/comments | None | Get comments |
| POST | /api/posts/:postId/comments | JWT | Create comment |
| PUT | /api/comments/:id | JWT | Update own comment |
| DELETE | /api/comments/:id | JWT | Delete comment |

## Example Postman Flow

### 1. Register

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "author1",
  "email": "author1@example.com",
  "password": "secret123",
  "role": "AUTHOR"
}
```

### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "author1",
  "password": "secret123"
}
```

Response:

```json
{
  "token": "..."
}
```

### 3. Call a protected route

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <JWT>
```

### 4. Wait for token expiry

After 2 minutes, call the same route again. It will fail with `401 Unauthorized` because the JWT is expired.

## How JWT Works in This Project

1. User submits login credentials.
2. Backend finds the user.
3. bcrypt verifies the password.
4. Backend creates a JWT using `jwt.sign()`.
5. JWT contains `userId` and `role` only.
6. JWT is returned to React.
7. React stores JWT in `localStorage`.
8. React retrieves JWT for protected requests.
9. React sends `Authorization: Bearer <JWT>`.
10. Express middleware extracts the token.
11. `jwt.verify()` validates the signature and expiration.
12. Decoded user information is attached to `req.user`.
13. Controller executes.
14. Prisma communicates with PostgreSQL.
15. After 2 minutes the JWT expires.
16. `jwt.verify()` rejects the token.
17. Backend returns `401`.
18. Frontend removes the expired token and redirects to login.

```text
                  LOGIN
                    │
                    ▼
            Verify credentials
                    │
                    ▼
               jwt.sign()
                    │
                    ▼
             JWT returned
                    │
                    ▼
              localStorage
                    │
                    ▼
        Authorization: Bearer JWT
                    │
                    ▼
           Express Middleware
                    │
                    ▼
              jwt.verify()
                    │
             ┌──────┴──────┐
             │             │
           Valid         Expired
             │             │
             ▼             ▼
          next()          401
             │
             ▼
        Controller
```

## Running the API

```bash
npm install
cp .env.example .env
npm run dev
```

## Next steps for this project

1. Create the local PostgreSQL database named `blog_db`.
2. Update the `.env` file with your PostgreSQL username and password.
3. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Start the API server:

```bash
npm run dev
```

5. Start the frontend in a separate terminal:

```bash
cd ../blog-client
npm run dev
```

6. Open the frontend at `http://localhost:5173` and the API at `http://localhost:5000`.

## Notes

- Do not commit `.env` files.
- Use PostgreSQL locally only.
- Keep the JWT expiration at 2 minutes for learning.
- Do not use refresh tokens.

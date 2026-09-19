# Build a JWT Authentication Blog Project
I want you to build a full-stack blog project primarily for **learning and understanding JWT authentication**.

The project should have a completely separate backend and frontend.

```
blog-api/
blog-client/
```
The backend should be a REST API, and the frontend should communicate with it through HTTP requests.

The most important learning objective is understanding the complete JWT authentication flow.

---

# 1. Technology Stack

## Backend
Use:

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- jsonwebtoken
- bcrypt or bcryptjs
- CORS
- dotenv
- JavaScript
- REST API
Do NOT use:

- Passport.js
- Passport Local Strategy
- Sessions
- OAuth
- Refresh tokens
Authentication must be implemented directly using `jsonwebtoken`.

---

# 2. Database — LOCAL ONLY
Use **PostgreSQL installed locally on my laptop**.

Do NOT use:

- Supabase
- Neon
- Railway PostgreSQL
- MongoDB Atlas
- any cloud database
- any online database
The database should exist only on my local machine for this project.

Example local PostgreSQL configuration:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db"  // password:Zoology@07
```
The database name should be:

```
blog_db
```
Explain how to:

1. Install PostgreSQL locally.
2. Create the `blog_db` database.
3. Configure the PostgreSQL username/password.
4. Put the connection string inside `.env`.
5. Run Prisma migrations.
6. Run Prisma Studio.
7. Reset the local database when needed.
Use Prisma for all database operations.

---

# 3. Database Models
Create these Prisma models.

## User

```
id
username
email
password
role
createdAt
updatedAt
```
Roles:

```
USER
AUTHOR
```
Passwords must be hashed using bcrypt.

Never store plaintext passwords.

---

## Post

```
id
title
content
published
authorId
createdAt
updatedAt
```
`published` must be a Boolean.

Example:

```
published = false
```
means the post exists in the database but is not publicly visible.

---

## Comment

```
id
content
postId
userId
createdAt
updatedAt
```
A comment belongs to:

- one user
- one post
Set up the Prisma relationships correctly.

---

# 4. JWT Authentication
JWT is the main purpose of this project.

Implement authentication directly with:

```
jsonwebtoken
```
The authentication flow should be:

```
Register
   ↓
Hash password
   ↓
Store user in PostgreSQL
```
Then:

```
Login
   ↓
Find user
   ↓
Compare password with bcrypt
   ↓
Create JWT
   ↓
Return JWT to frontend
```
Use a JWT payload similar to:

```
{
  "userId": 123,
  "role": "AUTHOR"
}
```
Do not put:

- password
- password hash
- sensitive personal information
inside the JWT.

---

# 5. JWT Expiration — EXACTLY 2 MINUTES
This is very important.

The JWT must expire after exactly:

```
2 minutes
```
Use:

```
jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2m"
});
```
Do NOT use:

```
1h
24h
7d
30d
```
Do NOT implement refresh tokens.

Do NOT automatically renew the JWT.

I intentionally want a 2-minute token so that I can observe what happens when a JWT expires.

---

# 6. JWT Middleware
Create:

```
src/middleware/authMiddleware.js
```
The middleware must:

1. Read the `Authorization` header.
2. Check for the Bearer scheme.
3. Extract the JWT.
4. Verify it using `jwt.verify()`.
5. Detect expired tokens.
6. Attach decoded user information to `req.user`.
7. Continue to the controller if valid.
8. Return `401 Unauthorized` if invalid or expired.
Expected request:

```
Authorization: Bearer <JWT_TOKEN>
```
Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 7. Explain How JWT Travels Between Frontend and Backend
This project is specifically for understanding this.

Clearly explain this flow:

```
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
      │ localStorage.setItem()
      ▼
localStorage
```
Then:

```
React
   │
   │ GET /api/auth/me
   │
   │ Authorization: Bearer <JWT>
   ▼
Express
   │
   ▼
JWT Middleware
   │
   │ jwt.verify()
   ▼
Controller
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```
Explain every step.

---

# 8. Frontend JWT Storage
For this educational project, store the JWT in:

```
localStorage
```
After login:

```
localStorage.setItem("token", response.token);
```
To access it:

```
const token = localStorage.getItem("token");
```
Then send it to protected endpoints:

```
fetch(`${API_URL}/api/auth/me`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```
Explain exactly what:

```
Authorization
Bearer
JWT
```
mean.

Also explain that localStorage has XSS-related security tradeoffs and is being used here because this project is specifically for learning the JWT request/response flow.

---

# 9. CORS
The frontend and backend must run as separate applications.

For example:

```
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```
Configure Express CORS correctly.

Use:

```
CLIENT_URL=http://localhost:5173
```
Do not use unrestricted CORS unnecessarily.

Explain why CORS is required when frontend and backend run on different origins.

---

# 10. Authentication Routes
Create:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```
`register`:

```
Public
```
`login`:

```
Public
```
`me`:

```
JWT required
```

---

# 11. Post Routes
Public:

```
GET /api/posts
GET /api/posts/:id
```
Only return published posts from public endpoints.

Protected author routes:

```
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
PATCH  /api/posts/:id/publish
```
Only authenticated authors should be able to use these routes.

The backend must enforce authorization.

Do not rely on React merely hiding buttons.

---

# 12. Comment Routes
Public:

```
GET /api/posts/:postId/comments
```
Authenticated users:

```
POST /api/posts/:postId/comments
```
Protected:

```
PUT    /api/comments/:id
DELETE /api/comments/:id
```
A normal user should only be able to modify/delete their own comments.

An AUTHOR can manage comments according to the authorization rules you define.

---

# 13. Authentication vs Authorization
Explain this clearly in the README.

```
Authentication
=
Who are you?

Authorization
=
What are you allowed to do?
```
Example:

```
JWT valid
   ↓
User authenticated
   ↓
Check role
   ↓
AUTHOR?
   ↓
Allow post creation
```
A valid JWT does NOT automatically mean the user can perform every action.

---

# 14. React Frontend
Create a separate React + Vite application.

The frontend must NOT connect directly to PostgreSQL.

Architecture:

```
React
  ↓
fetch()
  ↓
Express REST API
  ↓
JWT Middleware
  ↓
Controller
  ↓
Prisma
  ↓
Local PostgreSQL
```
Create:

```
Login
Register
Posts
Post Details
Author Dashboard
Create Post
Edit Post
```

---

# 15. Author Dashboard
The author dashboard should allow an authenticated author to:

```
View all posts
Create post
Edit post
Delete post
Publish post
Unpublish post
View comments
Delete comments
```
Display:

```
Published
Draft
```
for every post.

---

# 16. Demonstrate 2-Minute Expiration
The frontend should make it easy to understand JWT expiration.

Expected flow:

```
Login
   ↓
JWT received
   ↓
JWT stored in localStorage
   ↓
Protected request works
   ↓
Wait 2 minutes
   ↓
Protected request again
   ↓
JWT verification fails
   ↓
401 Unauthorized
   ↓
Remove JWT from localStorage
   ↓
Redirect to login
```
Display:

```
Your session has expired. Please log in again.
```
Do not implement refresh tokens.

---

# 17. Error Handling
Create centralized Express error handling.

Use appropriate HTTP status codes:

```
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```
Explain the difference between:

```
401 Unauthorized
```
and:

```
403 Forbidden
```
For an expired JWT, return:

```
{
    "error": "Token expired",
    "message": "Please login again"
}
```

---

# 18. Backend Structure
Use a structure similar to:

```
blog-api/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   ├── app.js
│   └── server.js
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 19. Frontend Structure
Use:

```
blog-client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
Create a reusable API helper for attaching the JWT.

---

# 20. Environment Variables
Backend:

```
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db"
JWT_SECRET="your-long-random-secret"
CLIENT_URL="http://localhost:5173"
```
Frontend:

```
VITE_API_URL="http://localhost:5000/api"
```
Provide `.env.example` files.

Never commit `.env`.

---

# 21. Prisma Commands
Document the local development workflow.

For example:

```
npm install
```
Then:

```
npx prisma migrate dev --name init
```
Generate Prisma Client:

```
npx prisma generate
```
Open Prisma Studio:

```
npx prisma studio
```
Explain what each command does.

Also explain how to reset the temporary local database when I want to start over.

---

# 22. API Documentation
Document every endpoint.

Use a table:

MethodEndpointAuthenticationDescriptionPOST`/api/auth/register`NoneRegisterPOST`/api/auth/login`NoneLogin and receive JWTGET`/api/auth/me`JWTCurrent userGET`/api/posts`NonePublished postsGET`/api/posts/:id`NonePublished postPOST`/api/posts`JWT + AUTHORCreate postPUT`/api/posts/:id`JWT + AUTHORUpdate postDELETE`/api/posts/:id`JWT + AUTHORDelete postPATCH`/api/posts/:id/publish`JWT + AUTHORPublish/unpublishGET`/api/posts/:postId/comments`NoneGet commentsPOST`/api/posts/:postId/comments`JWTCreate commentPUT`/api/comments/:id`JWTEdit own commentDELETE`/api/comments/:id`JWTDelete commentFor each endpoint document:

- URL
- HTTP method
- request body
- headers
- authentication requirement
- successful response
- error responses

---

# 23. Postman Testing
Provide complete Postman testing instructions.

Test this sequence:

### 1. Register

```
POST http://localhost:5000/api/auth/register
```

### 2. Login

```
POST http://localhost:5000/api/auth/login
```
Response:

```
{
    "token": "..."
}
```

### 3. Copy the JWT
Copy the returned token.

### 4. Call protected endpoint

```
GET http://localhost:5000/api/auth/me
```
Header:

```
Authorization: Bearer <JWT>
```

### 5. Wait 2 minutes
Call the same endpoint again.

Expected:

```
401 Unauthorized
```
Explain exactly why it fails.

---

# 24. JWT Learning Section
The README must contain a detailed section called:

# How JWT Works in This Project
Explain:

```
1. User submits login credentials.
2. Backend finds the user.
3. bcrypt verifies the password.
4. Backend creates a JWT using jwt.sign().
5. JWT contains userId and role.
6. JWT is returned to React.
7. React stores JWT in localStorage.
8. React retrieves JWT for protected requests.
9. React sends Authorization: Bearer <JWT>.
10. Express middleware extracts the token.
11. jwt.verify() validates the signature and expiration.
12. Decoded user information is attached to req.user.
13. Controller executes.
14. Prisma communicates with PostgreSQL.
15. After 2 minutes the JWT expires.
16. jwt.verify() rejects the token.
17. Backend returns 401.
18. Frontend removes the expired token and sends the user to login.
```
Show this diagram:

```
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
             │
             ▼
          Prisma
             │
             ▼
    Local PostgreSQL
```

---

# 25. Important Code Comments
Add comments specifically around JWT.

For example:

```
// The backend creates a signed JWT after successful login.
// The token expires after 2 minutes.
const token = jwt.sign(
    {
        userId: user.id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "2m"
    }
);
```
And:

```
// Extract the JWT from:
// Authorization: Bearer <token>
const authHeader = req.headers.authorization;
```
And:

```
// jwt.verify() checks both:
// 1. Whether the token was signed using our secret
// 2. Whether the token has expired
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
The comments should teach me what is happening rather than merely describing the code.

---

# 26. Security Explanation
Explain that:

```
JWT ≠ encryption
```
JWT payloads should not contain secrets because normal JWT payloads are readable after decoding.

Explain:

```
Signature
=
prevents unauthorized modification

Expiration
=
limits how long the token can be used

HTTPS
=
protects the token while being transmitted

Authorization
=
determines what the authenticated user can do
```
Also explain the security tradeoff of localStorage.

For this learning project, however, keep the implementation exactly as requested:

```
JWT + localStorage + Authorization Bearer header
```

---

# 27. No Unnecessary Technologies
Keep the project focused.

Do NOT add:

- Passport
- sessions
- refresh tokens
- OAuth
- Redis
- Docker
- GraphQL
- Redux
- microservices
- cloud database
- unnecessary authentication libraries
The core stack should remain:

```
React
   +
Express
   +
JWT
   +
bcrypt
   +
Prisma
   +
Local PostgreSQL
   +
CORS
```

---

# 28. Final Goal
The project should allow me to understand this exact concept:

```
Frontend
    │
    │ Login
    ▼
Backend
    │
    │ jwt.sign()
    ▼
JWT
    │
    │ returned to frontend
    ▼
localStorage
    │
    │ Authorization: Bearer JWT
    ▼
Backend
    │
    │ jwt.verify()
    ▼
Authenticated request
    │
    ▼
Authorization check
    │
    ▼
Controller
    │
    ▼
Prisma
    │
    ▼
Local PostgreSQL
```
The application itself does not need to be visually complex.

Prioritize **clear backend code, JWT visibility, API documentation, comments, and understanding the authentication lifecycle** over fancy UI.

At the end, give me a concise explanation of:

1. Where the JWT is created.
2. Where it is stored.
3. How the frontend sends it.
4. How Express extracts it.
5. How `jwt.verify()` works.
6. How expiration works.
7. How protected routes work.
8. How authorization differs from authentication.
9. What happens after 2 minutes.
10. How to inspect the JWT during development.
11. How to run the complete project locally
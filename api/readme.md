# JWT Blog Project Learning Guide

This project is a full-stack blog application built to learn how authentication, authorization, JWT, Express, Prisma, PostgreSQL, and frontend-backend communication work together in a real project.

The goal is not just to build a working app, but to understand the flow from scratch:

- How a user registers
- How a password is hashed
- How a JWT is created and sent
- How the backend verifies the token
- How protected routes are guarded
- How the frontend stores user state and sends requests
- How Prisma connects to PostgreSQL
- How role-based access works for authors vs normal users

---

## 1. Project Overview

This project contains:

- a backend API using Node.js and Express
- a database using PostgreSQL with Prisma ORM
- JWT authentication for user login and protected requests
- a frontend built with React + Vite
- role-based access where some users are normal users and others are authors

The core idea is to create a blog where:

- anyone can view public posts
- only logged-in users can comment
- only authors can create, update, and publish posts

---

## 2. Why This Project Matters

This project shows the real full-stack flow in a way beginners can understand.

Before code, these are the big concepts:

### Authentication
Authentication means: "Who are you?"

Example:

- user logs in with username + password
- backend verifies credentials
- if valid, backend issues a token

### Authorization
Authorization means: "What are you allowed to do?"

Example:

- a normal user may view posts and comment
- an author may create or publish posts
- a user cannot edit another user's post

### JWT
JWT means JSON Web Token.

It is a compact, signed token used to represent user identity.

A JWT usually contains:

- user id
- username
- role
- expiry time

It is signed by the backend using a secret key.

This lets the backend verify later whether the user is valid without storing session data in the database for every request.

---

## 3. Technologies Used

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- bcryptjs
- jsonwebtoken
- dotenv
- CORS

### Frontend
- React
- Vite
- React Router
- fetch / API wrapper

---

## 4. Basic Full-Stack Flow

The application follows this general flow:

```text
User enters login data in frontend
        ↓
Frontend sends request to backend API
        ↓
Backend checks username and password
        ↓
Backend hashes/compares password
        ↓
Backend creates JWT
        ↓
Token is sent back to frontend
        ↓
Frontend stores token in localStorage
        ↓
Frontend sends token on future requests
        ↓
Backend verifies token in middleware
        ↓
Backend allows or denies access based on role and route
```

---

## 5. Database Design

The project uses Prisma and PostgreSQL. The main database model is simple but powerful.

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  AUTHOR
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  comments  Comment[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### What this means

- a user can have many posts
- a user can have many comments
- a post belongs to one author
- a comment belongs to one user and one post

This is a classic relational database design.

---

## 6. Why Prisma?

Prisma is an ORM.

ORM stands for Object Relational Mapping.

It helps you work with the database using JavaScript/TypeScript objects instead of writing raw SQL manually.

Benefits:

- easier database access
- safer queries
- better readability
- strong schema-based modeling
- migrations support

Example Prisma command:

```bash
npx prisma migrate dev --name init
```

This creates the tables in PostgreSQL and tracks the migration history.

---

## 7. PostgreSQL and DATABASE_URL

The backend connects to PostgreSQL through a connection string.

Example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db"
```

This string tells Prisma:

- which database engine to use: PostgreSQL
- which user: postgres
- which password: YOUR_PASSWORD
- which host: localhost
- which port: 5432
- which database: blog_db

This is the critical connection configuration for the app.

---

## 8. Password Security with bcrypt

Never store plain text passwords in a real app.

The app uses bcrypt to hash the password before storing it.

Example:

```js
const bcrypt = require('bcryptjs');

const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, user.password);
```

### Why bcrypt?

- password is converted to a hash
- hashing is one-way
- even if database is exposed, plain passwords are not visible
- login compares the entered password with the stored hash

This is one of the first security lessons in backend development.

---

## 9. JWT in Detail

JWT is the heart of this application.

### JWT Creation

```js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: '2m' }
);
```

### What is happening here?

- payload contains user details
- secret key signs the token
- expiry is set to 2 minutes

The token is then returned to the frontend.

### JWT Verification

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

This verifies:

- token hasn't been tampered with
- token is signed by our secret
- token is still valid and not expired

### Why expiry matters

This project sets tokens to expire in 2 minutes to demonstrate real-world security behavior.

If the token expires, the user must log in again.

---

## 10. Authorization Header and Bearer Tokens

When the frontend sends a protected request, it uses the Authorization header.

```js
const token = localStorage.getItem('token');

fetch(`${API_URL}/api/auth/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

This means:

- token is being sent in HTTP headers
- Bearer indicates the token is used as the authentication credential
- backend reads the header and verifies it

---

## 11. Middleware Pattern

Middleware is a common Express concept used to run code before a route handler.

Example flow:

```js
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};
```

### Why this is important

Middleware helps you protect routes centrally.

Instead of repeating checks in every route, you attach middleware once and reuse it.

---

## 12. Protected Routes and Role Checks

Routes are protected by middleware and also checked for user role.

Example:

```js
router.post('/', authMiddleware, authorizeAuthor, async (req, res) => {
  // create post
});
```

This means:

- request must have a valid token
- user must have role AUTHOR to create a post

This is authorization logic.

### Role check example

```js
const authorizeAuthor = (req, res, next) => {
  if (req.user.role !== 'AUTHOR') {
    return res.status(403).json({ message: 'Only authors can do this' });
  }

  next();
};
```

This is how the app enforces business rules.

---

## 13. Frontend State Management with localStorage

The frontend stores the token and user data in localStorage so the app remembers the login state.

Example from the React app:

```jsx
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});
```

Then, after login or register:

```jsx
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
```

### Why this matters

This allows the app to keep the authentication state across refreshes and page navigations in a simple way.

---

## 14. Frontend to Backend Communication

The frontend must send requests to the backend using the API URL.

Example:

```js
export const api = {
  get: (url) => fetch(`${API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.json()),
};
```

This is the connection between:

- React UI
- Express routes
- Prisma database

---

## 15. Real Request Flow

### Step 1: Register user

Frontend sends a POST request:

```http
POST /api/auth/register
Content-Type: application/json
```

Body:

```json
{
  "username": "author1",
  "email": "author1@example.com",
  "password": "secret123",
  "role": "AUTHOR"
}
```

Backend logic:

1. validates input
2. checks if username or email already exists
3. hashes password with bcrypt
4. saves the user to PostgreSQL
5. generates JWT
6. returns token and user info to frontend

---

### Step 2: Login

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "username": "author1",
  "password": "secret123"
}
```

Backend logic:

1. finds user by username
2. compares password with bcrypt
3. creates JWT
4. returns token

---

### Step 3: Fetch current user

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Backend logic:

1. reads token from header
2. verify with JWT_SECRET
3. decode payload
4. fetch user from database
5. return user details

---

### Step 4: Create a post

```http
POST /api/posts
Authorization: Bearer <token>
```

Body:

```json
{
  "title": "My first post",
  "content": "This is the content of the post."
}
```

Backend logic:

1. verify user token
2. check author role
3. save post to Post table
4. return created data

---

### Step 5: View public posts

```http
GET /api/posts
```

This route is public, so no login is required.

The app presents a blog feed to users and visitors.

---

## 16. Folder Structure and Meaning

A typical structure for this type of project is:

```text
project/
├── blog-api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── blog-client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Why this separation matters

- backend API handles business logic and security
- frontend handles user experience
- database logic is isolated in Prisma
- route layers are clean and organized

This is how modern web apps are usually built.

---

## 17. Important Security Rules Learned

This project teaches key backend principles:

### Do not trust frontend-only checks
The frontend can be modified by the user.
The backend must always validate access.

### Never trust raw user input blindly
Always validate and sanitize user-entered values.

### Protect every sensitive route
Routes like create post, delete post, and profile access should be guarded.

### Use roles for authorization
User role is a real security concept.

### Use environment variables
Never hardcode secrets in source files.

Example:

```env
JWT_SECRET=your_super_secret_key
DATABASE_URL=postgresql://...
```

---

## 18. Real-Life Application Concepts

This project is a mini version of how real social media, CMS, and SaaS apps work.

Examples:

- users create accounts
- tokens represent logged-in sessions
- protected APIs require valid tokens
- roles restrict actions
- database relations connect entities together
- frontend displays data fetched from backend

This is a real-world architecture pattern used in production apps.

---

## 19. Common Errors Learnt While Building

These are typical problems that appear in real projects:

### 1. Wrong PostgreSQL connection string
This causes database connection failures.

### 2. Missing JWT secret
The server cannot sign or verify tokens.

### 3. Token expired
JWT expires in short periods, so users need to log in again.

### 4. Route mismatch
Frontend calls one route while backend expects another route.

### 5. User state lost after refresh
If the app doesn't store user data, login state disappears.

### 6. Role mismatch
A normal user might be allowed to hit an author-only route without proper checks.

These issues teach debugging habits and real architecture awareness.

---

## 20. What This Project Teaches Overall

By the end of this project, the learner understands:

- how Express servers work
- how to build REST APIs
- how to connect Node.js to PostgreSQL
- how Prisma models database tables
- how bcrypt hashes passwords
- how JWT authentication works
- how Bearer tokens are used
- how middleware protects routes
- how authorization differs from authentication
- how frontend apps keep user sessions
- how to connect React to a backend
- how protected and public routes behave differently
- how role-based apps are structured in real projects

This is the foundation for building bigger apps such as:

- blogging platforms
- e-commerce apps
- task management apps
- social media websites
- dashboards and admin systems

---

## 21. Minimal Example: Full Login Flow

```js
// backend register route
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
    },
  });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2m' }
  );

  res.json({ token, user });
});
```

```jsx
// frontend login handling
const handleLogin = async () => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};
```

```js
// backend protected route
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  res.json({ user });
});
```

This is the full story in simple form.

---

## 22. Final Thought

This project is more than a blog. It is a learning project that helps you understand how authentication and authorization work in real web apps.

The biggest idea to remember is:

- frontend is for presentation
- backend is for logic and security
- database stores data
- JWT proves identity
- middleware protects routes
- roles control access

If you understand these concepts, you are already thinking like a backend and full-stack developer.

---

## 23. Quick Start Commands

If you want to run the project locally:

```bash
cd blog-api
npm install
npx prisma migrate dev --name init
npm run dev
```

Then start the frontend:

```bash
cd blog-client
npm install
npm run dev
```

Make sure your `.env` file contains:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## 24. Summary

This app is a complete learning journey through:

- Express backend
- Prisma database modelling
- PostgreSQL setup
- JWT authentication
- bcrypt password hashing
- middleware protections
- route guarding
- role-based authorization
- full-stack frontend communication

It is a practical project that turns theory into a working system.

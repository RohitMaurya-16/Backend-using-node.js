# Prisma File Manager Project

This project is a beginner-friendly Express + Prisma application for managing folders and uploaded files. It uses:

- Express for the web server
- Prisma ORM with SQLite for local storage
- Passport.js for session-based authentication
- Prisma session store for saving user sessions in the database
- Multer for local file uploads
- EJS for views

## Why this project exists

This project is designed so a user can learn how Prisma, Passport, sessions, and file uploads fit together in a real web app without needing cloud storage or a heavy setup.

## Folder structure

- prisma/
  - schema.prisma
  - seed.js
- config/
  - passport.js
- controllers/
  - authController.js
  - folderController.js
  - fileController.js
  - dashboardController.js
- routes/
  - authRoutes.js
  - folderRoutes.js
  - fileRoutes.js
  - dashboardRoutes.js
- views/
  - auth/
  - folders/
  - dashboard.ejs
  - notFound.ejs
- uploads/
  - local file storage for uploaded files
- .env.example
- server.js

## Database design

The local Prisma database stores:

- users
- folders
- uploaded files
- sessions

### User
- id
- username
- email
- passwordHash
- createdAt
- updatedAt

### Folder
- id
- name
- description
- createdAt
- updatedAt
- userId

### FileRecord
- id
- name
- originalName
- mimeType
- size
- fileUrl
- storageMode
- uploadedAt
- userId
- folderId

### Session
- id
- sid
- data
- expiresAt

## Prisma notes

Prisma lets you work with a database using a strongly typed schema. In this project, SQLite is used as a simple local database so it works without any external service.

The important pieces are:

1. schema.prisma defines the full database model.
2. Prisma Client is used inside controllers to query and save data.
3. Prisma migrations are the standard way to update the schema.
4. Prisma is good for beginners because it keeps database operations readable and organized.

## Authentication notes

Passport.js handles login and session-based auth. The app is configured to:

- accept login using email + password
- hash passwords using bcrypt
- save the user into the session
- load the user back from the session when the next request arrives

The Prisma session store saves session data in the database instead of memory, which makes the app more reliable and easier to scale.

## Upload notes

Multer is used for file uploads. Files are saved in the local filesystem for now. The database stores metadata such as:

- original file name
- MIME type
- file size
- timestamp
- folder association
- file path or URL

This is a good educational setup before moving to cloud storage like Cloudinary or Supabase.

## Validation rules

The file upload flow includes:

- file size limit
- restricted allowed file types
- folder-based organization
- metadata recording in the database

## Extra credit ideas

You can later add:

- share links for folders
- expiration dates for shared folders
- public download access
- cloud storage integration with Cloudinary or Supabase
- user-specific role permissions

## Running the app

1. Copy .env.example to .env
2. Install dependencies:
   npm install
3. Generate Prisma client:
   npx prisma generate
4. Create the database tables:
   npx prisma db push
5. Seed sample admin user and folders:
   node prisma/seed.js
6. Start the app:
   npm start

Then open:

- http://localhost:3000

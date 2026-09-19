# Prisma project knowledge guide

This file explains the important design ideas in a way that is easier to understand for beginners.

## 1. What is Prisma?

Prisma is an ORM. It helps you talk to a database using JavaScript or TypeScript code instead of writing raw SQL everywhere.

Benefits:
- clearer database model definition
- easier data access in Express routes
- safer validation of data types
- easier migrations and schema changes

In this project, Prisma is used with SQLite so the app can run locally without extra database setup.

## 2. Why use Prisma with Express?

Express is the server framework. Prisma is the database layer.

In a real application:
- Express handles HTTP routes
- Passport handles authentication
- Prisma handles user, folder, and uploaded file data

This separation keeps the code easier to understand and maintain.

## 3. Database model overview

The project includes these entities:

- User
- Folder
- FileRecord
- Session
- ShareToken

These are all defined in the Prisma schema.

## 4. Why sessions are stored in the database

Session storage in memory is simple, but it is not persistent. If the server restarts, the user may be logged out.

Using Prisma session storage means:
- session data survives restarts
- session state is stored with the rest of the app data
- it is easier to understand in a single app database

## 5. Why Passport?

Passport is an authentication library for Node.js. It helps you:
- validate a login attempt
- create a session after login
- restore a user on future requests

This project uses a local strategy, which means the user logs in with email + password.

## 6. Why multer?

Multer is middleware for handling multipart form data. That is how browser uploads work.

It allows the server to:
- read uploaded files from a form
- save them to disk
- read the file metadata like size and MIME type
- store the information in the database

## 7. Why store files locally first?

For learning, local storage is the easiest. It keeps the project simple and does not require external cloud credentials.

Later, you can swap to:
- Cloudinary
- Supabase storage
- AWS S3

The database would still keep the file URL or public link, but the actual file storage moves to the cloud.

## 8. Why validate uploads?

Files can be dangerous or too large. Validation keeps the app safe and fast.

This project restricts:
- maximum file size
- allowed MIME types

This is a good beginner pattern.

## 9. What is a folder-based file manager?

This app organizes files by folder. Each folder belongs to a user. Each file belongs to a user and optionally to a folder.

This pattern is useful for:
- personal file storage
- project management
- shared workspace systems

## 10. Extra credit: share links

The share link feature is useful because it allows unauthenticated users to access a shared folder for a time-limited period.

A shared link would normally include:
- a generated UUID token
- an expiration date
- validation that the token is still active

This is a good feature to add after the base app works.

## 11. How to decide whether this is a good project

This project is good if you want to learn:
- Express routing
- Prisma schema design
- authentication flows
- session persistence
- file uploads
- local database use for demos

It is not meant to replace a production cloud storage system, but it is a strong educational base.

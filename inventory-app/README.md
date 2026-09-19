# Inventory Application

This project is a full inventory management app built with Express and EJS. It stores data in an in-memory temporary store so it runs instantly without needing a database service.

## Entity design and relationships

### 1. Category
- id: number
- name: string
- description: string
- created_at: ISO date string

A category has many items.

### 2. Item
- id: number
- name: string
- sku: string
- description: string
- price: number
- quantity: number
- category_id: number
- created_at: ISO date string

Each item belongs to exactly one category.

### Relationship summary
- One category can contain many items.
- Each item belongs to one category.
- Deletion rule: a category cannot be deleted if it still has items. This prevents accidental data loss and preserves integrity. Instead, the app asks the user to remove or reassign items before deleting the category.

### Admin protection
Update and delete actions require a valid admin password. This is enforced in the route/controller layer using the `ADMIN_PASSWORD` environment variable.

## Temporary storage behavior
This version intentionally stores all inventory data in memory while the app is running. When the server restarts, the data resets. This is useful for local development, demos, and testing before connecting to a real database.

## Local setup

1. Install dependencies:
   npm install
2. Start the app:
   npm start
3. Optional: load sample data:
   npm run db:seed

Open http://localhost:3000

## Notes
The app is ready for a permanent database later, but for now it stores inventory data temporarily in memory to keep the project simple and runnable.

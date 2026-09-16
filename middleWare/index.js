// index.js
import express from "express";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";

const app = express();

app.use(express.json());

// Routers mount karna
app.use("/users", userRouter);
app.use("/books", bookRouter);

// Home Route with Clickable HTML Links
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h1>Welcome to My Express App</h1>
      <p>Click on the links below to navigate:</p>
      <ul style="list-style: none; padding: 0;">
        <button style="margin: 10px 0;"><a href="/users" style="font-size: 18px; color: blue; text-decoration: none;">👉 View All Users</a></button>
        <button style="margin: 10px 0;"><a href="/books" style="font-size: 18px; color: blue; text-decoration: none;">👉 View All Books</a></button>
      </ul>
    </div>
  `);
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
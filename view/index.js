import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ⚠️ Custom 'view' folder configuration (singular)
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

// Static assets (CSS) ke liye public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Routers mount karna
app.use("/users", userRouter);
app.use("/books", bookRouter);

// Home route
app.get("/", (req, res) => {
  res.render("index", { message: "Welcome to EJS Server-Side Rendering!" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Internal Server Error");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
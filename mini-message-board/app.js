import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Since ES Modules don't have built-in __dirname, we calculate it using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Import our router module using ES import syntax
import indexRouter from "./routes/index.js";

// Set up EJS as the view engine and specify the "views" directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse POST request body data from forms into req.body
app.use(express.urlencoded({ extended: true }));

// Mount our router on the root path
app.use("/", indexRouter);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mini Message Board running smoothly at http://localhost:${PORT}`);
});
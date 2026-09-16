import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prdRouter from "./routes/productRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
	res.redirect("/products");
});

app.use("/products", prdRouter);

app.use((err, req, res, next) => {
	console.error(err.message);
	res.status(err.statusCode || 500).send(err.statusCode ? err.message : "Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
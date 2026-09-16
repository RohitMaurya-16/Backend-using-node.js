// routes/bookRouter.js
import { Router } from "express";
import { getBooks, getBookById } from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:bookId", getBookById);

export default bookRouter;
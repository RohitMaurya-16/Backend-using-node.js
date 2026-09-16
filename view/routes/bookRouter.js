import { Router } from "express";
import { renderBooks } from "../controllers/bookController.js";

const bookRouter = Router();
bookRouter.get("/", renderBooks);

export default bookRouter;
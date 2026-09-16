import { Router } from "express";
import { renderUsers } from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/", renderUsers);

export default userRouter;
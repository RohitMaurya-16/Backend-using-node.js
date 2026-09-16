// routes/userRouter.js
import { Router } from "express";
import { getUsers, getUserById } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);

export default userRouter;
// controllers/userController.js
import * as db from "../db.js";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";

export async function getUsers(req, res) {
  const users = await db.getAllUsers();
  res.json(users);
}

export async function getUserById(req, res) {
  const userId = Number(req.params.userId);
  const user = await db.getUserById(userId);

  if (!user) {
    throw new CustomNotFoundError("User nahi mila!");
  }

  res.json(user);
}
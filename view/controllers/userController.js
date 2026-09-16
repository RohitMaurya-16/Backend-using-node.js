import * as db from "../db.js";

export async function renderUsers(req, res) {
  const users = await db.getAllUsers();
  // 'view' folder ke andar 'users' subfolder ki 'list.ejs' file render kar rahe hain
  res.render("users/list", { users });
}
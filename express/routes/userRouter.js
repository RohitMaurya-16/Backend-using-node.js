import { Router } from "express";
const userRouter = Router();

const users = [
  { id: 1, name: "Rohit Maurya", role: "Developer", email: "rohit@example.com" },
  { id: 2, name: "Anjali Maurya", role: "Student", email: "anjali@example.com" }
];

userRouter.get("/", (req, res) => {
  res.json(users);
});

userRouter.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(404).json({ error: "User nahi mila!" });
  res.json(user);
});

export default userRouter;
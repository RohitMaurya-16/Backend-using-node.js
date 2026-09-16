import { Router } from "express";
const bookRouter = Router();

const books = [
  { id: 101, userId: 1, title: "Clean Code", author: "Robert C. Martin" },
  { id: 102, userId: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 103, userId: 2, title: "The Alchemist", author: "Paulo Coelho" }
];

bookRouter.get("/", (req, res) => {
  res.json(books);
});

bookRouter.get("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const book = books.find(b => b.id === parseInt(bookId));
  if (!book) return res.status(404).json({ error: "Book nahi mili!" });
  res.json(book);
});

export default bookRouter;
// controllers/bookController.js
import * as db from "../db.js";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";

export async function getBooks(req, res) {
  const books = await db.getAllBooks();
  res.json(books);
}

export async function getBookById(req, res) {
  const bookId = Number(req.params.bookId);
  const book = await db.getBookById(bookId);

  if (!book) {
    throw new CustomNotFoundError("Book nahi mili!");
  }

  res.json(book);
}
import * as db from "../db.js";

export async function renderBooks(req, res) {
  const books = await db.getAllBooks();
  // 'view' folder ke andar 'books' subfolder ki 'index.ejs' file render kar rahe hain
  res.render("books/index", { books });
}

// import * as db from "../db.js";

// export async function renderBooks(req,res)
// {
//   const book=await db.getAllBooks();
//   res.render("books/index",{books})
// }
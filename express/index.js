//Given code till line 63 is use to show use of req.parmas and req.query--> read it carefully....


// import express from 'express'
// const app=express();

// const library = [
//     { slug: "kingkong", title: "King Kong: The Eighth Wonder", pages: 320 },
//     { slug: "harry-potter", title: "Harry Potter & the Philosopher's Stone", pages: 223 }
// ];

// app.get('/books/:bookSlug',(req,res)=>
// {
//     const slug=req.params.bookSlug;

//     const data=library.find(books=>books.slug===slug);
//     if(data)
//     {
//         res.send(`Find the book ${data.slug} and title of this books is ${data.title} and total pages is ${data.pages}`);
//     }
// });

// app.listen(2000,()=>
// {
//     console.log(`Successfuly get data: use localhost:2000`);
// })

// import express from 'express';
// const app = express();

// const library = [
//     { slug: "kingkong", title: "King Kong: The Eighth Wonder", pages: 320 },
//     { slug: "harry-potter", title: "Harry Potter & the Philosopher's Stone", pages: 223 },
//     { slug: "the-hobbit", title: "The Hobbit", pages: 310 }
// ];

// // Route to get ALL books, with optional query filters
// app.get('/books', (req, res) => {
//     // 1. Destructure the query parameters from req.query
//     const { maxPages, sort } = req.query;
    
//     let filteredBooks = [...library];

//     // 2. Filter: If 'maxPages' is provided, only keep shorter books
//     if (maxPages) {
//         // Note: Query parameters are always strings, so we convert them to numbers
//         filteredBooks = filteredBooks.filter(book => book.pages <= Number(maxPages));
//     }

//     // 3. Sort: If 'sort' is provided, arrange by page numbers
//     if (sort === 'asc') {
//         filteredBooks.sort((a, b) => a.pages - b.pages);
//     } else if (sort === 'desc') {
//         filteredBooks.sort((a, b) => b.pages - a.pages);
//     }

//     // 4. Return the result
//     res.send(filteredBooks);
// });

// app.listen(2000, () => {
//     console.log(`Server is running at http://localhost:2000`);
// });


//Given code till line 92  is use to show use of modularisation--> read it carefully....


import express from "express";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/books", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome! Try visiting /users or /books");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}!`);
});
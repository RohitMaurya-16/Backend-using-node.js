// db.js

const users = [
  { id: 1, name: "Rohit Maurya", role: "Developer", age: 26, isActive: true },
  { id: 2, name: "Anjali Maurya", role: "Student", age: 21, isActive: true },
  { id: 3, name: "Amit Sharma", role: "Designer", age: 29, isActive: false },
  { id: 4, name: "Priya Patel", role: "Manager", age: 34, isActive: true },
  { id: 5, name: "Vikram Singh", role: "Developer", age: 31, isActive: true },
  { id: 6, name: "Neha Gupta", role: "Data Scientist", age: 27, isActive: true },
  { id: 7, name: "Rohan Verma", role: "Student", age: 22, isActive: false },
  { id: 8, name: "Sneha Reddy", role: "QA Engineer", age: 25, isActive: true },
  { id: 9, name: "Rahul Mishra", role: "DevOps Engineer", age: 33, isActive: true },
  { id: 10, name: "Kiran Joshi", role: "HR Specialist", age: 28, isActive: false },
  { id: 11, name: "Suresh Kumar", role: "Developer", age: 40, isActive: true },
  { id: 12, name: "Deepika Rao", role: "Product Manager", age: 35, isActive: true },
  { id: 13, name: "Arjun Nair", role: "Student", age: 19, isActive: true },
  { id: 14, name: "Divya Choudhary", role: "UI/UX Designer", age: 24, isActive: true },
  { id: 15, name: "Yash Wardhan", role: "Developer", age: 28, isActive: false },
  { id: 16, name: "Pooja Malhotra", role: "Content Writer", age: 30, isActive: true },
  { id: 17, name: "Manish Tiwari", role: "Business Analyst", age: 32, isActive: true },
  { id: 18, name: "Swati Bose", role: "Student", age: 23, isActive: true },
  { id: 19, name: "Gaurav Saxena", role: "Security Engineer", age: 36, isActive: false },
  { id: 20, name: "Ritu Kapoor", role: "Marketing Lead", age: 29, isActive: true }
];

const books = [
  { id: 101, title: "Clean Code", author: "Robert C. Martin", genre: "Tech", year: 2008 },
  { id: 102, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", year: 2018 },
  { id: 103, title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Tech", year: 1999 },
  { id: 104, title: "Deep Work", author: "Cal Newport", genre: "Self-Help", year: 2016 },
  { id: 105, title: "Introduction to Algorithms", author: "Thomas H. Cormen", genre: "Tech", year: 2009 },
  { id: 106, title: "You Don't Know JS", author: "Kyle Simpson", genre: "Tech", year: 2015 },
  { id: 107, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", year: 1988 },
  { id: 108, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", year: 2011 },
  { id: 109, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year: 1960 },
  { id: 110, title: "Design Patterns", author: "Erich Gamma", genre: "Tech", year: 1994 },
  { id: 111, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", year: 2011 },
  { id: 112, title: "The Subtly Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-Help", year: 2016 },
  { id: 113, title: "Refactoring", author: "Martin Fowler", genre: "Tech", year: 1999 },
  { id: 114, title: "Zero to One", author: "Peter Thiel", genre: "Business", year: 2014 },
  { id: 115, title: "The Lean Startup", author: "Eric Ries", genre: "Business", year: 2011 },
  { id: 116, title: "Head First Design Patterns", author: "Eric Freeman", genre: "Tech", year: 2004 },
  { id: 117, title: "1984", author: "George Orwell", genre: "Fiction", year: 1949 },
  { id: 118, title: "The Phoenix Project", author: "Gene Kim", genre: "Tech", year: 2013 },
  { id: 119, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance", year: 1997 },
  { id: 120, title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", genre: "Tech", year: 2015 }
];

// Returns all users (supports optional role filtering)
export async function getAllUsers(roleFilter) {
  if (roleFilter) {
    return users.filter(u => u.role.toLowerCase() === roleFilter.toLowerCase());
  }
  return users;
}

// Fixed: Parsed userId to Number to ensure strict evaluation (===) works correctly
export async function getUserById(userId) {
  return users.find(u => u.id === Number(userId));
}

// Returns all books (supports optional genre filtering)
export async function getAllBooks(genreFilter) {
  if (genreFilter) {
    return books.filter(b => b.genre.toLowerCase() === genreFilter.toLowerCase());
  }
  return books;
}

// Fixed: Parsed bookId to Number to ensure strict evaluation (===) works correctly
export async function getBookById(bookId) {
  return books.find(b => b.id === Number(bookId));
}

const users = [
  { id: 1, name: "Rohit Maurya", role: "Developer" },
  { id: 2, name: "Anjali Maurya", role: "Student" }
];

const books = [
  { id: 101, title: "Clean Code", author: "Robert C. Martin" },
  { id: 102, title: "Atomic Habits", author: "James Clear" }
];

export async function getAllUsers() {
  return users;
}

export async function getAllBooks() {
  return books;
}
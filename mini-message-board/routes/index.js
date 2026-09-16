import { Router } from "express";
const router = Router();

// Sample messages array stored in memory (server-side)
const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  }
];

// GET Index route ("/") - Displays all messages
router.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages: messages });
});

// GET New Message form route ("/new") - Renders the form template
router.get("/new", (req, res) => {
  res.render("form");
});

// POST New Message route ("/new") - Handles form submission
router.post("/new", (req, res) => {
  // Grab the data sent from input name attributes in the form
  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;

  // Push the new message object into our messages array
  messages.push({ 
    text: messageText, 
    user: messageUser, 
    added: new Date() 
  });

  // Redirect user back to the homepage to see the updated message board
  res.redirect("/");
});

// GET Message Detail route ("/message/:id") - Displays a single message based on its index
router.get("/message/:id", (req, res) => {
  const messageId = req.params.id;
  const message = messages[messageId];
  
  // Render the message detail view template, passing the single message object
  res.render("message", { message: message });
});

// Export router using ES module export syntax
export default router;
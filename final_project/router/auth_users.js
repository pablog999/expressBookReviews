const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_secret_key";

const isValid = (username) => {
    return users.some(user => user.username === username);
  };

  const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  };

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required!" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }
     req.session.authorization = { username };

    return res.status(200).json({ message: "Login successful!", username });

    // Generate JWT Token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  
    return res.status(200).json({ message: "Login successful!", token });
  });




// Add a book review

regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in!" });
    }

    const username = req.session.authorization.username; // Get username from session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content required!" });
    }

    // Ensure the book has a reviews object
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review for the logged-in user
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully!", reviews: books[isbn].reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

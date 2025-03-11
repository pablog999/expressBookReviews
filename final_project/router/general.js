const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(res.status(200).json(books)), 1000);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    return new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            setTimeout(() => resolve(res.status(200).json(books[isbn])), 1000);
        } else {
            reject(res.status(404).json({ message: "Book not found" }));
        }
    }).catch(err => res.json(err));
});
  
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    return new Promise((resolve, reject) => {
        const author = req.params.author;
        let booksByAuthor = Object.values(books).filter(book => book.author === author);

        if (booksByAuthor.length > 0) {
            setTimeout(() => resolve(res.status(200).json(booksByAuthor)), 1000);
        } else {
            reject(res.status(404).json({ message: "No books found by this author" }));
        }
    }).catch(err => res.json(err));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    return new Promise((resolve, reject) => {
        const title = req.params.title;
        let booksByTitle = Object.values(books).filter(book => book.title === title);

        if (booksByTitle.length > 0) {
            setTimeout(() => resolve(res.status(200).json(booksByTitle)), 1000);
        } else {
            reject(res.status(404).json({ message: "No books found with this title" }));
        }
    }).catch(err => res.json(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;  
  const book = books[isbn];  

  if (book) {
      return res.status(200).json(book.reviews);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

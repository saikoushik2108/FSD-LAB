const express = require("express");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Book data
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350
    },
    {
        id: 2,
        title: "Wings of Fire",
        author: "A. P. J. Abdul Kalam",
        price: 450
    },
    {
        id: 3,
        title: "The Guide",
        author: "R. K. Narayan",
        price: 300
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("Book Management REST API is running");
});

// GET - All books
app.get("/api/books", (req, res) => {
    res.json(books);
});

// GET - Book by ID
app.get("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST - Add new book
app.post("/api/books", (req, res) => {

    const { title, author, price } = req.body;

    if (!title || !author || !price) {
        return res.status(400).json({
            message: "Title, author and price are required"
        });
    }

    const newBook = {
        id: books.length + 1,
        title: title,
        author: author,
        price: price
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// PUT - Update book
app.put("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;

    res.json({
        message: "Book updated successfully",
        book: book
    });
});

// DELETE - Delete book
app.delete("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
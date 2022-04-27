const prisma = require("./config/db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Book routes

// Get all books
app.get("/", async (req, res) => {
  try {
    const book = await prisma.books.findMany();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a book
app.get("/livro/:book_id", async (req, res) => {
  try {
    const id = req.params;
    const book = await prisma.books.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a book
app.post("/", async (req, res) => {
  try {
    const { name, price, author, sinopse, quantity, stock } = req.body;
    const postBook = await prisma.books.create({
      data: {
        name,
        price,
        author,
        sinopse,
        quantity,
        stock,
      },
    });
    res.send("Top demais");
    res.status(200).json(postBook);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Update a book
app.put("/:book_id", async (req, res) => {
  try {
    const id = req.params;
    const { name, price, author, sinopse, quantity, stock, item } = req.body;
    const putBook = await prisma.post.update({
      where: { id },
      data: {
        name,
        price,
        author,
        sinopse,
        quantity,
        stock,
        item,
      },
    });
    res.status(200).json(putBook);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a book
app.delete("/:book_id", async (req, res) => {
  try {
    const id = req.params;
    const deleteBook = await prisma.books.delete({
      where: {
        id,
      },
    });
    res.status(200).json(deleteBook);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log("Server Runnig on port 3000");
});

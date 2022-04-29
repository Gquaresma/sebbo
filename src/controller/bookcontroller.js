const prisma = require("../config/db");

module.exports = {
  createBook: async (req, res) => {
    try {
      const { name, price, author, sinopse, stock } = req.body;

      console.log(parseInt(stock, 10));

      const postBook = await prisma.books.create({
        data: {
          name,
          price: Number(price),
          author,
          sinopse,
          stock: parseInt(stock, 10),
        },
      });

      res.status(201).json(postBook);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  },

  findAll: async (_, res) => {
    try {
      const book = await prisma.books.findMany();

      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  findOne: async (req, res) => {
    try {
      const id = req.params.id;
      const book = await prisma.books.findUnique({
        where: { id },
      });

      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  updateBook: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, price, author, sinopse, stock } = req.body;

      console.log(name, price, author, sinopse, stock)

      const book = await prisma.books.findUnique({
        where: { id },
      });

      console.log(book);

      const putBook = await prisma.post.update({
        where: { id },
        data: {
          name: name || book.name,
          price: Number(price) || book.price,
          author: author || book.author,
          sinopse: sinopse || book.sinopse,
          stock: parseInt(stock) || book.stock,
        },
      });

      console.log(putBook);

      res.status(200).json(putBook);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  },

  deleteBook: async (req, res) => {
    try {
      const id = req.params.id;

      const deleteBook = await prisma.books.delete({
        where: { id },
      });
      res.status(200).json(deleteBook);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  },
};

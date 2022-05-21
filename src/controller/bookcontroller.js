import prisma from "../config/db.js";

import imgUpload from "../helpers/imgHelper.js";

export async function createBook(req, res) {
  try {
    const { name, price, author, sinopse, stock } = req.body;

    const file = req.file;
    const imgUrl = await imgUpload(file);

    const postBook = await prisma.books.create({
      data: {
        name,
        price: Number(price),
        author,
        sinopse,
        stock: parseInt(stock, 10),
        image: imgUrl,
      },
    });

    res.status(201).json(postBook);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
}
export async function findAll(_, res) {
  try {
    const book = await prisma.books.findMany();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
export async function findOne(req, res) {
  try {
    const id = req.params.id;
    const book = await prisma.books.findUnique({
      where: { id },
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
export async function updateBook(req, res) {
  try {
    const id = req.params.id;
    const { name, price, author, sinopse, stock } = req.body;

    console.log(name, price, author, sinopse, stock);

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

<<<<<<< HEAD
      const putBook = await prisma.books.update({
        where: { id },
        data: {
          name: name || book.name,
          price: Number(price) || book.price,
          author: author || book.author,
          sinopse: sinopse || book.sinopse,
          stock: parseInt(stock) || book.stock,
        },
      });
=======
    res.status(200).json(putBook);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
}
export async function deleteBook(req, res) {
  try {
    const id = req.params.id;
>>>>>>> 5dfb77e82d2b8694e88ce17620aba84a08dc61f8

    const deleteBook = await prisma.books.delete({
      where: { id },
    });
    res.status(200).json(deleteBook);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
}

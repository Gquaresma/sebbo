const prisma = require("../config/db");
// import { hash, compare } from "bcrypt";

module.exports = {
  createPurchase: async (req, res) => {
    try {
      const { userId, bookId } = req.params;

      const book = await prisma.books.findUnique({
        where: {
          id: bookId,
        },
      });

      const cart = await prisma.purchases.create({
        data: {
          value: book.price,
          buyer: {
            connect: {
              id: userId,
            },
          },
          items: {
            create: [
              {
                quantity: 1,
                book_id: bookId,
              },
            ],
          },
        },
      });

      res.status(201).json(cart);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getCartPurchase: async (req, res) => {
    try {
      const purchase = await prisma.purchases.findMany();

      res.status(200).json(purchase);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPurchaseById: async (req, res) => {
    try {
      const { purchaseId } = req.params;
      const purchase = await prisma.purchases.findUnique({
        where: {
          id: purchaseId,
        },
        include: {
          items: true,
        },
      });

      if (!purchase) {
        res.status(400).json({ message: "Compra não encontrada" });
      }
      res.status(200).json(purchase);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addItem: async (req, res) => {
    try {
      const { id } = req.body;

      const purchase = await prisma.purchases.findMany();

      const item = await prisma.items.create({
        data: {
          quantity: 1,
          book_id: id,
          purchase: {
            connect: {
              id: purchase.id,
            },
          },
        },
      });

      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removerItem: async (req, res) => {
    try {
      const { id } = req.body;

      await prisma.items.delete({
        where: {
          id,
        },
      });

      res.status(200).json({ message: "Item removido " });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addQuantity: async (req, res) => {
    try {
      const { quantity, id } = req.body;

      const item = await prisma.items.findUnique({
        where: {
          id,
        },
      });

      const updateQuantity = await prisma.items.update({
        where: { id },
        data: {
          quantity: item.quantity + Number.parseInt(quantity),
        },
      });

      res.status(200).json(updateQuantity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeQuantity: async (req, res) => {
    try {
      const { quantity, id } = req.body;

      const item = await prisma.items.findUnique({
        where: {
          id,
        },
      });

      const updateQuantity = await prisma.items.update({
        where: { id },
        data: {
          quantity: item.quantity - Number.parseInt(quantity),
        },
      });

      res.status(200).json(updateQuantity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  confirmPurchase: async (req, res) => {
    try {
      const { id } = req.body;

      const purchase = await prisma.purchases.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });

      purchase.items.forEach(async (el) => {
        const book = await prisma.books.findUnique({
          where: {
            id: el.book_id,
          },
        });

        await prisma.books.update({
          where: {
            id: el.book_id,
          },

          data: {
            stock: book.stock - el.quantity,
          },
        });
      });

      await prisma.purchases.update({
        where: {
          id: purchaseId,
        },
        data: {
          status: "Confirmada",
        },
      });

      res.status(200).json({ message: "Compra efetuada" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

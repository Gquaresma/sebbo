const prisma = require("../config/db");
// import { hash, compare } from "bcrypt";

module.exports = {
  createPurchase: async (req, res) => {
    try {
      const { userId, bookId } = req.params;

      // console.log("got book", userId, bookId);

      const book = await prisma.books.findUnique({
        where: {
          id: bookId,
        },
      });

      // console.log("got book", book);

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

      // console.log("created cart", cart);

      const purchase = await prisma.purchases.findUnique({
        where: {
          id: cart.id,
        },
        include: {
          items: true,
        },
      });

      return res.status(201).json(purchase);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getCartPurchase: async (req, res) => {
    try {
      const purchases = await prisma.purchases.findMany({
        where: {
          status: "pedente",
        },
      });
      const cartPurchase = purchases[0];

      console.log("sdtd", cartPurchase);

      if (!cartPurchase) {
        // gambi triste
        await prisma.items.deleteMany({});
        await prisma.purchases.deleteMany({});
        return res.status(200).json(cartPurchase);
      }

      const purchase = await prisma.purchases.findUnique({
        where: {
          id: cartPurchase.id,
        },
        select: {
          id: true,
          created_at: true,
          status: true,
          value: true,
          buyer: true,
          items: {
            orderBy: [
              {
                id: 'desc',
              },
            ],
            select: {
              id: true,
              quantity: true,
              book: true,
            },
          },
        },
      });

      res.status(200).json(purchase);
    } catch (error) {
      console.log(error.message);
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

      const findItem = await prisma.items.findUnique({
        where: {
          book_id: id,
        },
      });

      const previousValue = findItem ? findItem.quantity : 0;

      const item = await prisma.items.upsert({
        where: {
          book_id: id,
        },
        update: {
          quantity: previousValue + 1,
        },
        create: {
          quantity: 1,
          book_id: id,
          purchase_id: purchase[0].id,
        },
      });

      res.status(200).json(item);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  removerItem: async (req, res) => {
    try {
      const { id } = req.body;

      await prisma.items.delete({
        where: {
          book_id: id,
        },
      });

      res.status(200).json({ message: "Item removido " });
    } catch (error) {
      console.log(error.message);
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

      console.log("fff", item);

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

      let updateQuantity = {};
      if (item && item.quantity === 1) {
        await prisma.items.delete({
          where: {
            id,
          },
        });
      } else {
        updateQuantity = await prisma.items.update({
          where: { id },
          data: {
            quantity: item.quantity - Number.parseInt(quantity),
          },
        });
      }

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
          id,
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

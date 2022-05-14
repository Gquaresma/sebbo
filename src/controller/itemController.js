const prisma = require("../config/db");

const getCartPurchaseHelper = async (userId) => {
  const pendingPurchases = await prisma.purchases.findMany({
    where: {
      AND: [
        {
          status: "pedente",
        },
        {
          user_id: userId,
        },
      ],
    },

    include: {
      items: true,
    },
  });
  return pendingPurchases[0];
};

const getItemByBookId = async (items, bookId) => {
  for (let el of items) {
    if (el.book_id === bookId) {
      return el;
    }
  }
};

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
      const { userId } = req.params;

      console.log(req.user);

      const purchases = await prisma.purchases.findMany({
        where: {
          AND: [
            {
              status: "pedente",
            },

            {
              user_id: userId,
            },
          ],
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
                id: "desc",
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

      if (!purchases) {
        return res.status(404).json({ message: "Compra não encontrada" });
      }

      console.log("cart --- ", purchases);

      return res.status(200).json(purchases);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getPurchaseById: async (req, res) => {
    try {
      const { purchaseId, userId } = req.params;

      const purchase = await prisma.purchases.findUnique({
        where: {
          id: purchaseId,
        },
        include: {
          items: true,
        },
      });

      if (!purchase) {
        res.status(404).json({ message: "Compra não encontrada" });
      }
      res.status(200).json(purchase);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addItem: async (req, res) => {
    try {
      const { id } = req.body;
      const { userId } = req.params;

      const cart = await getCartPurchaseHelper(userId);
      const items = cart.items;
      const item = getItemByBookId(items, id);

      const previousValue = item ? item.quantity : 0;

      const newItem = await prisma.items.upsert({
        where: {
          id: item ? item.id : undefined,
        },
        update: {
          quantity: previousValue + 1,
        },
        create: {
          quantity: 1,
          book_id: id,
          purchase_id: cart.id,
        },
      });

      res.status(200).json(newItem);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  removerItem: async (req, res) => {
    try {
      const { id } = req.body;
      const { userId } = req.params;

      const cart = await getCartPurchaseHelper(userId);
      const items = cart.items;
      const item = getItemByBookId(items, id);

      if (item) {
        await prisma.items.delete({
          where: {
            id: item.id,
          },
        });
        return res.status(200).json({ message: "Item removido com sucesso" });
      }

      const newItem = await prisma.items.update({
        where: {
          id: item ? item.id : undefined,
        },
        data: {
          quantity: previousValue - 1,
        },
      });

      res.status(404).json({ message: "Item não encontrado" });
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
      const { id } = req.body;
      // const { userId } = req.params;

      const item = await prisma.items.findUnique({
        where: {
          id,
        },
      });

      const previousQuantity = item ? item.quantity : 0;

      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      if (previousQuantity <= 1) {
        await prisma.items.delete({
          where: {
            id: item.id,
          },
        });
        return res.status(200).json({ message: "Item removido com sucesso" });
      }

      await prisma.items.update({
        where: {
          id: item.id,
        },
        data: {
          quantity: previousValue - 1,
        },
      });

      res.status(200).json({ message: "Quantidade atualizada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  confirmPurchase: async (req, res) => {
    try {
      const { userId } = req.params;
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

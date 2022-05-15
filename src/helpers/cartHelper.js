const prisma = require("../config/db");

module.exports = {
  getCartPurchaseHelper: async (userId) => {
    const pendingPurchases = await prisma.purchases.findMany({
      where: {
        AND: [
          {
            status: "Pendente",
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
  },

  getItemByBookId: async (items, bookId) => {
    for (let el of items) {
      if (el.book_id === bookId) {
        return el;
      }
    }
  },
};

import prisma from "../config/db.js";

export async function getCartPurchaseHelper(userId) {
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
}
export async function getItemByBookId(items, bookId) {
  for (let el of items) {
    if (el.book_id === bookId) {
      return el;
    }
  }
}

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

    select: {
        id: true,
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
  return pendingPurchases[0];
}
export async function getItemByBookId(items, bookId) {
  console.log(items);
  for (let el of items) {
    if (el.book.id === bookId) {
      return el;
    }
  }
}

import prisma from "../config/db.js";
import {
  getCartPurchaseHelper,
  getItemByBookId,
} from "../helpers/cartHelper.js";

export async function createPurchase(req, res) {
  try {
    const { userId } = req.params;

    await prisma.purchases.create({
      data: {
        buyer: {
          connect: {
            id: userId,
          },
        },
        items: {
          create: [],
        },
      },
    });

    return res.status(201).json({ message: "successfully created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}
export async function getCartPurchase(req, res) {
  try {
    const { userId } = req.params;

    console.log(req.user);

    const purchase = await prisma.purchases.findFirst({
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

    if (!purchase) {
      return res.status(404).json({ message: "Compra não encontrada" });
    }

    console.log("cart --- ", purchase);

    return res.status(200).json(purchase);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}
export async function getPurchaseById(req, res) {
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
      res.status(404).json({ message: "Compra não encontrada" });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function getPurchases(req, res) {
  try {
    const { userId } = req.params;

    const purchases = await prisma.purchases.findMany({
      where: {
        AND: [
          {
            user_id: userId,
          },
          {
            status: "Confirmada",
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

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function addItem(req, res) {
  try {
    const { id } = req.body;
    const { userId } = req.params;

    const cart = await getCartPurchaseHelper(userId);
    console.log(cart);
    const items = cart.items;
    const item = await getItemByBookId(items, id);

    const previousValue = item ? item.quantity : 0;

    const newItem = await prisma.items.upsert({
      where: {
        id: item ? item.id : "",
      },
      update: {
        quantity: Number.parseInt(previousValue + 1),
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
}
export async function removerItem(req, res) {
  try {
    const { id } = req.body;
    const { userId } = req.params;

    const cart = await getCartPurchaseHelper(userId);
    const items = cart.items;
    const item = await getItemByBookId(items, id);

    if (item) {
      await prisma.items.delete({
        where: {
          id: item.id,
        },
      });
      return res.status(200).json({ message: "Item removido com sucesso" });
    }

    res.status(404).json({ message: "Item não encontrado" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}
export async function addQuantity(req, res) {
  try {
    const { id } = req.body;

    const item = await prisma.items.findUnique({
      where: {
        id,
      },
    });

    const updateQuantity = await prisma.items.update({
      where: { id },
      data: {
        quantity: item.quantity + 1,
      },
    });

    res.status(200).json(updateQuantity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function removeQuantity(req, res) {
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
        quantity: previousQuantity - 1,
      },
    });

    res.status(200).json({ message: "Quantidade atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function confirmPurchase(req, res) {
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
}

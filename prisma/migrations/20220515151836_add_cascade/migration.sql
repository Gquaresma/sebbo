-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

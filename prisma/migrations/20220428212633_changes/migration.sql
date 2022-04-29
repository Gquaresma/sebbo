/*
  Warnings:

  - You are about to drop the column `quantity` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Users` table. All the data in the column will be lost.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "nome",
DROP COLUMN "senha",
DROP COLUMN "telefone",
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "password" VARCHAR(50) NOT NULL,
ADD COLUMN     "phone" VARCHAR(50) NOT NULL;

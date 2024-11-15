-- AlterTable
ALTER TABLE "Order" ADD COLUMN "tableNumber" INTEGER NOT NULL DEFAULT 0;

-- After adding the column with a default value, you can remove the default
ALTER TABLE "Order" ALTER COLUMN "tableNumber" DROP DEFAULT;
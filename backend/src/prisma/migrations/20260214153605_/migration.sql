/*
  Warnings:

  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keep_id` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `percent_allocations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_limits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `restricted_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_coupons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "coupons_coupon_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "coupons";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "keep_id";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "percent_allocations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "products";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "purchase_items";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "purchase_limits";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "purchases";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "restricted_products";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_coupons";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "lottery_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "open_time" TEXT NOT NULL DEFAULT '06:00',
    "close_time" TEXT NOT NULL DEFAULT '14:30',
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "lottery_type_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lottery_type_id" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "old_value" TEXT NOT NULL,
    "new_value" TEXT NOT NULL,
    "changed_by_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lottery_type_logs_lottery_type_id_fkey" FOREIGN KEY ("lottery_type_id") REFERENCES "lottery_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lottery_rounds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "round_number" INTEGER NOT NULL DEFAULT 0,
    "round_date" DATETIME NOT NULL,
    "lottery_type_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "lottery_rounds_lottery_type_id_fkey" FOREIGN KEY ("lottery_type_id") REFERENCES "lottery_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_restricted_numbers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "max_amount" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT '2ตัว',
    "lottery_type_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restricted_numbers_lottery_type_id_fkey" FOREIGN KEY ("lottery_type_id") REFERENCES "lottery_types" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_restricted_numbers" ("created_at", "id", "max_amount", "number", "type") SELECT "created_at", "id", "max_amount", "number", "type" FROM "restricted_numbers";
DROP TABLE "restricted_numbers";
ALTER TABLE "new_restricted_numbers" RENAME TO "restricted_numbers";
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bet_type_code" TEXT NOT NULL,
    "bet_type_label" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "customer_id" INTEGER,
    "customer_name" TEXT NOT NULL DEFAULT 'ลูกค้าทั่วไป',
    "user_id" INTEGER,
    "user_name" TEXT NOT NULL DEFAULT 'ADMIN',
    "round_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "lottery_rounds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "bet_type_code", "bet_type_label", "created_at", "customer_id", "customer_name", "id", "number", "user_id", "user_name") SELECT "amount", "bet_type_code", "bet_type_label", "created_at", "customer_id", "customer_name", "id", "number", "user_id", "user_name" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT,
    "phone" TEXT NOT NULL DEFAULT '',
    "line_id" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'customer',
    "status" TEXT NOT NULL DEFAULT 'offline',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "id", "password", "role", "updatedAt", "username") SELECT "createdAt", "id", "password", "role", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "lottery_types_code_key" ON "lottery_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "lottery_rounds_round_date_lottery_type_id_key" ON "lottery_rounds"("round_date", "lottery_type_id");

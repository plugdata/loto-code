-- CreateTable
CREATE TABLE "round_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "round_id" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL,
    "round_date" DATETIME NOT NULL,
    "lottery_type_id" INTEGER NOT NULL,
    "lottery_type_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tx_count" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

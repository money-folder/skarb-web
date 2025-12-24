-- CreateTable
CREATE TABLE "earnings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "money_amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "comment" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "owner_id" UUID NOT NULL,

    CONSTRAINT "earnings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

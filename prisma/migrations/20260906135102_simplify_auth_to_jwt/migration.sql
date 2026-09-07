-- Drop NextAuth tables
DROP TABLE "accounts";
DROP TABLE "sessions";
DROP TABLE "verificationtokens";

-- users: add new columns nullable, backfill, then constrain
ALTER TABLE "users" ADD COLUMN "username" VARCHAR(255);
ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;
ALTER TABLE "users" ADD COLUMN "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- minimum backfill so NOT NULL can be applied; old rows are fixed/deleted manually later
UPDATE "users"
SET "username" = "email",
    "password_hash" = '!';

ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;

DROP INDEX "users_email_key";
ALTER TABLE "users"
  DROP COLUMN "name",
  DROP COLUMN "email",
  DROP COLUMN "email_verified",
  DROP COLUMN "image";

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

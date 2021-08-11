CREATE EXTENSION "uuid-ossp";
-- CreateTable
CREATE TABLE "AccountVerification" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChangedDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" VARCHAR NOT NULL,
    "userId" UUID,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChangedDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" VARCHAR NOT NULL,
    "userId" UUID,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChangedDateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "passwordHash" VARCHAR NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerification.code_unique" ON "AccountVerification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerification.userId_unique" ON "AccountVerification"("userId");

-- CreateIndex
CREATE INDEX "account_verification_idx_code" ON "AccountVerification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset.code_unique" ON "PasswordReset"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset.userId_unique" ON "PasswordReset"("userId");

-- CreateIndex
CREATE INDEX "password_reset_idx_code" ON "PasswordReset"("code");

-- CreateIndex
CREATE INDEX "user_idx_username" ON "User"("username");

-- CreateIndex
CREATE INDEX "user_idx_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_unique_idx_username_email" ON "User"("username", "email");

-- AddForeignKey
ALTER TABLE "AccountVerification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

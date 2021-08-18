/*
  Warnings:

  - A unique constraint covering the columns `[userId,organisationId]` on the table `OrgsMemberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orgsmemberships_unique_idx_userid_organisationid" ON "OrgsMemberships"("userId", "organisationId");

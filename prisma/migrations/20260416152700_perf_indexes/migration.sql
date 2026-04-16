-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Message_projectId_phaseId_createdAt_idx" ON "Message"("projectId", "phaseId", "createdAt");

-- CreateIndex
CREATE INDEX "Phase_projectId_sortOrder_idx" ON "Phase"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlanSnapshot_projectId_phaseId_updatedAt_idx" ON "PlanSnapshot"("projectId", "phaseId", "updatedAt");

-- CreateIndex
CREATE INDEX "Project_ownerId_updatedAt_idx" ON "Project"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

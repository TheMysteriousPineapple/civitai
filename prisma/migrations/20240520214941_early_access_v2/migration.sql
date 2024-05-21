-- AlterEnum
ALTER TYPE "Availability" ADD VALUE 'EarlyAccess';

-- AlterTable
ALTER TABLE "EntityAccess" ADD COLUMN     "meta" JSONB DEFAULT '{}',
ADD COLUMN     "permissions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ModelVersion" DROP COLUMN "earlyAccessTimeFrame",
ADD COLUMN     "earlyAccessConfig" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "earlyAccessEndsAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "DonationGoal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goalAmount" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "modelVersionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEarlyAccess" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DonationGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "donationGoalId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "buzzTransactionId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DonationGoal" ADD CONSTRAINT "DonationGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationGoal" ADD CONSTRAINT "DonationGoal_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ModelVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donationGoalId_fkey" FOREIGN KEY ("donationGoalId") REFERENCES "DonationGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

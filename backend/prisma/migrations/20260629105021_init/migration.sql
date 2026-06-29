-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Processing', 'Fail', 'Success');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'Processing',

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

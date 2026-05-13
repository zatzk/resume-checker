-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawText" TEXT,
    "techStack" TEXT,
    "idioms" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stats" TEXT,
    "status" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    CONSTRAINT "Project_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "applicationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CV_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL,
    "salaryRange" TEXT,
    "link" TEXT,
    "openDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidatureDate" DATETIME,
    "requirements" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnalysisReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cvId" TEXT NOT NULL,
    "atsScore" INTEGER NOT NULL,
    "careerScore" INTEGER NOT NULL,
    "strategistScore" INTEGER NOT NULL,
    "atsFeedback" TEXT NOT NULL,
    "careerFeedback" TEXT NOT NULL,
    "strategistFeedback" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalysisReport_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

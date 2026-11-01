-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hitPoints" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

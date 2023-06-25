-- CreateTable
CREATE TABLE "Room" (
    "code" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "dateOnly" BOOLEAN NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enableTimes" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

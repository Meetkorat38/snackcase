-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "hight" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "croppedImageUrl" TEXT,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

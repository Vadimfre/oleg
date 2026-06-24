-- CreateTable
CREATE TABLE "Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "duration" REAL NOT NULL,
    "elevation" INTEGER NOT NULL,
    "gpxFile" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_slug_key" ON "Route"("slug");

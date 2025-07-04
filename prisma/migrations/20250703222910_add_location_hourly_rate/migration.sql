-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TattooArtist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT NOT NULL DEFAULT 'İstanbul',
    "hourlyRate" REAL NOT NULL DEFAULT 500,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TattooArtist" ("bio", "createdAt", "experience", "id", "imageUrl", "isActive", "name", "rating", "specialty", "updatedAt") SELECT "bio", "createdAt", "experience", "id", "imageUrl", "isActive", "name", "rating", "specialty", "updatedAt" FROM "TattooArtist";
DROP TABLE "TattooArtist";
ALTER TABLE "new_TattooArtist" RENAME TO "TattooArtist";
CREATE UNIQUE INDEX "TattooArtist_name_key" ON "TattooArtist"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

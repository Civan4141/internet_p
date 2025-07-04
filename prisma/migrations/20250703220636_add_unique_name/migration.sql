/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TattooArtist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TattooArtist_name_key" ON "TattooArtist"("name");

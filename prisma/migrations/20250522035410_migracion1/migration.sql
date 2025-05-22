-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numeroSerie" TEXT NOT NULL,
    "fechaEmision" DATETIME NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "solicitud" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fotoUrl" TEXT
);
INSERT INTO "new_Documento" ("dni", "fechaEmision", "fotoUrl", "id", "nombre", "numeroSerie", "solicitud", "tipoDocumento") SELECT "dni", "fechaEmision", "fotoUrl", "id", "nombre", "numeroSerie", "solicitud", "tipoDocumento" FROM "Documento";
DROP TABLE "Documento";
ALTER TABLE "new_Documento" RENAME TO "Documento";
CREATE UNIQUE INDEX "Documento_numeroSerie_key" ON "Documento"("numeroSerie");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

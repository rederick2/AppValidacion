-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numeroSerie" TEXT NOT NULL,
    "fechaEmision" DATETIME NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "solicitud" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Documento_numeroSerie_key" ON "Documento"("numeroSerie");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { numeroSerie } = req.query

  if (!numeroSerie) {
    return res.status(400).json({ error: 'Número de serie requerido' })
  }

  const documento = await prisma.documento.findUnique({
    where: { numeroSerie }
  })

  if (!documento) {
    return res.status(404).json({ error: 'Documento no encontrado' })
  }

  res.status(200).json(documento)
}

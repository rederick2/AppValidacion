import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) return res.status(400).json({ error: 'ID requerido' })

  const documento = await prisma.documento.findUnique({
    where: { id: parseInt(id) }
  })

  if (!documento || !documento.fotoBlob) {
    return res.status(404).json({ error: 'Imagen no encontrada' })
  }

  // Establecer el tipo de contenido correcto (ajusta si es jpeg)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', documento.fotoBlob.length)

  // ✅ Enviar el buffer como respuesta
  res.send(Buffer.from(documento.fotoBlob))
}

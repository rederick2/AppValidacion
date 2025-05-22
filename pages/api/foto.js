import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) return res.status(400).json({ error: 'ID requerido' })

  try {
    const documento = await prisma.documento.findUnique({
      where: { id: parseInt(id) }
    })

    if (!documento || !documento.fotoBlob) {
      return res.status(404).json({ error: 'Imagen no encontrada' })
    }

    res.setHeader('Content-Type', 'image/png') // o image/jpeg según corresponda
    res.send(documento.fotoBlob)
  } catch (error) {
    console.error('Error al obtener imagen:', error)
    res.status(500).json({ error: 'Error al obtener imagen' })
  } finally {
    await prisma.$disconnect()
  }
}

export default async function handler(req, res) {
  const { id } = req.query

  const prisma = new PrismaClient()
  const documento = await prisma.documento.findUnique({
    where: { id: parseInt(id) }
  })

  if (!documento || !documento.fotoBlob) return res.status(404).end()

  res.setHeader('Content-Type', 'image/jpeg') // o image/png según el tipo real
  res.send(documento.fotoBlob)
}
import { IncomingForm } from 'formidable'
import { PrismaClient } from '@prisma/client'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const prisma = new PrismaClient()

  const form = new IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al parsear formulario:', err)
      return res.status(500).json({ error: 'Error al procesar el formulario' })
    }

    const rawFoto = files.foto
    const foto = Array.isArray(rawFoto) ? rawFoto[0] : rawFoto

    if (!foto || !foto.filepath) {
      return res.status(400).json({ error: 'No se recibió el archivo' })
    }

    try {
      const buffer = await import('fs/promises').then(fs => fs.readFile(foto.filepath))

      await prisma.documento.create({
        data: {
          numeroSerie: fields.numeroSerie.toString(),
          fechaEmision: new Date(fields.fechaEmision.toString()),
          tipoDocumento: fields.tipoDocumento.toString(),
          solicitud: fields.solicitud.toString(),
          dni: fields.dni.toString(),
          nombre: fields.nombre.toString(),
          fotoBlob: buffer, // ✅ GUARDADO en BYTEA
        }
      })

      return res.status(200).json({ mensaje: 'Documento guardado correctamente' })

    } catch (error) {
      console.error('Error al leer archivo o guardar:', error)
      return res.status(500).json({ error: 'Error al procesar la imagen: ' + error.message })
    } finally {
      await prisma.$disconnect()
    }
  })
}

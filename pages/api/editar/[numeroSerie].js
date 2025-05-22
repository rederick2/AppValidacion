import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const { numeroSerie } = req.query;

  try {
    const data = await parseForm(req);
    const { fields, files } = data;

    const {
      numeroSerie: nuevoNumeroSerie,
      fechaEmision,
      tipoDocumento,
      solicitud,
      dni,
      nombre,
    } = fields;

    const foto = files.foto;
    let fotoUrl = null;

    if (foto) {
      const fotoNombre = `${Date.now()}-${foto.originalFilename}`;
      const fotoPath = path.join(process.cwd(), 'public', 'uploads', fotoNombre);

      try {
        await fs.copyFile(foto.filepath, fotoPath);
        fotoUrl = `/uploads/${fotoNombre}`;
      } catch (e) {
        console.error('Error al copiar el archivo:', e);
        return res.status(500).json({ message: 'Error al copiar el archivo: ' + e.message });
      }
    }

    const prisma = new PrismaClient();

    try {
      const documentoActualizado = await prisma.documento.update({
        where: {
          numeroSerie: numeroSerie,
        },
        data: {
          numeroSerie: nuevoNumeroSerie,
          fechaEmision: new Date(fechaEmision),
          tipoDocumento,
          solicitud,
          dni,
          nombre,
          ...(fotoUrl ? { fotoUrl } : {}),
        },
      });

      res.status(200).json({ message: 'Documento actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      res.status(500).json({ message: 'Error al actualizar el documento' });
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el controlador: ' + err.message });
  }
}

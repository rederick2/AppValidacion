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
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const data = await parseForm(req);
    const { fields, files } = data;

    const {
      numeroSerie,
      fechaEmision,
      tipoDocumento,
      solicitud,
      dni,
      nombre,
    } = fields;

    const rawFoto = files.foto;
    const foto = Array.isArray(rawFoto) ? rawFoto[0] : rawFoto;

    if (!foto || !foto.filepath) {
      return res.status(400).json({ error: 'Archivo de imagen no válido' });
    }

    //const fotoUrl = `/uploads/${path.basename(foto.filepath)}`;

    //const fotoNombre = `${Date.now()}-${foto.originalFilename}`;
    //const fotoPath = path.join(process.cwd(), 'public', 'uploads', fotoNombre);

    /*try {
      //await fs.copyFile(foto.filepath, fotoPath);
      await fs.rename(foto.filepath, fotoPath)

    } catch (e) {
      console.error('Error al copiar el archivo:', e);
      return res.status(500).json({ message: 'Error al copiar el archivo: ' + e.message });
    }*/

    //const fotoUrl = `/uploads/${fotoNombre}`;
    //const fotoUrl = `/uploads/${path.basename(foto.filepath)}`
    const buffer = await fs.readFile(foto.filepath) // lee binario

    const prisma = new PrismaClient();

    try {
      await prisma.documento.create({
        data: {
          numeroSerie,
          fechaEmision: new Date(fechaEmision),
          tipoDocumento,
          solicitud,
          dni,
          nombre,
          fotoBlob: buffer // ✅ se guarda en BYTEA
        },
      });

      res.status(200).json({ message: 'Documento registrado con éxito' });
    } catch (error) {
      console.error('Error al crear el documento:', error);
      res.status(500).json({ error: 'Error al registrar el documento' });
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar - ' + err });
  }
}

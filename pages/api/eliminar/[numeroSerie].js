import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { numeroSerie } = req.query;

  if (req.method === 'DELETE') {
    try {
      const prisma = new PrismaClient();

      await prisma.documento.delete({
        where: {
          numeroSerie: numeroSerie,
        },
      });

      res.status(200).json({ mensaje: 'Documento eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      res.status(500).json({ error: 'Error al eliminar el documento' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

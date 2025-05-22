import { PrismaClient } from '@prisma/client';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Documentos({ documentos }) {
  const [filtro, setFiltro] = useState('');
  const router = useRouter();

  const documentosFiltrados = useMemo(() => {
    return documentos.filter(documento =>
      documento.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      documento.numeroSerie?.toLowerCase().includes(filtro.toLowerCase()) ||
      documento.dni?.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [documentos, filtro]);

  const handleDelete = async (numeroSerie) => {
    try {
      const res = await fetch(`/api/eliminar/${numeroSerie}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data.mensaje);
      router.push('/documentos');
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  return (
    <Layout>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <h1>Lista de Documentos Registrados</h1>
            <Form.Group className="mb-3">
              <Form.Label>Filtrar por nombre, número de serie o DNI:</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su búsqueda" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            </Form.Group>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Número de Serie</th>
                  <th>Fecha de Emisión</th>
                  <th>Tipo de Documento</th>
                  <th>Solicitud</th>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((documento) => (
                  <tr key={documento.numeroSerie}>
                    <td>
                      <img src={`/api/foto?id=${documento.id}`} alt="Foto" style={{ width: '50px' }} />
                    </td>
                    <td>{documento.numeroSerie}</td>
                    <td>{new Date(documento.fechaEmision).toLocaleDateString()}</td>
                    <td>{documento.tipoDocumento}</td>
                    <td>{documento.solicitud}</td>
                    <td>{documento.dni}</td>
                    <td>{documento.nombre}</td>
                    <td>
                      <a href={`/verificacion/${documento.numeroSerie}`} title="Verificar" className="btn btn-sm">
                        <i className="bi bi-search"></i>
                      </a>
                      <a href={`/editar/${documento.numeroSerie}`} title="Editar" className="btn btn-sm ms-2">
                        <i className="bi bi-pencil"></i>
                      </a>
                      <button className="btn btn-danger ms-2" onClick={() => handleDelete(documento.numeroSerie)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const prisma = new PrismaClient();
  const documentos = await prisma.documento.findMany();

  return {
    props: {
      documentos: JSON.parse(JSON.stringify(documentos)),
    },
  };
}

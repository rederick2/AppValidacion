import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import Layout from '../components/Layout';

export default function Documentos() {
  return (
    <Layout>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h1>Registro de Documentos</h1>
            <p>
              Ir al <Link href="/registro">Registro</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

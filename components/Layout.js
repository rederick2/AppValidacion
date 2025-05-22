import Head from 'next/head';
import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Verificador de Documentos</title>
      </Head>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Verificador de Documentos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link>Inicio</Nav.Link>
              </Link>
              <Link href="/registro" passHref legacyBehavior>
                <Nav.Link>Registro</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        {children}
      </Container>
    </>
  );
};

export default Layout;

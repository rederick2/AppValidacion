import { useState, useCallback, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { PrismaClient } from '@prisma/client';

export default function EditarDocumento({ documento }) {
  const [datos, setDatos] = useState({
    numeroSerie: documento.numeroSerie,
    fechaEmision: new Date(documento.fechaEmision).toISOString().split('T')[0],
    tipoDocumento: documento.tipoDocumento,
    solicitud: documento.solicitud,
    dni: documento.dni,
    nombre: documento.nombre,
    fotoUrl: documento.fotoUrl,
  });

  const [errores, setErrores] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!documento) {
      toast.error('Documento no encontrado');
      router.push('/documentos');
    }
  }, [documento, router]);

  const handleChange = useCallback((e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }, [datos]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!datos.numeroSerie) nuevosErrores.numeroSerie = 'El número de serie es obligatorio.';
    if (!datos.fechaEmision) nuevosErrores.fechaEmision = 'La fecha de emisión es obligatoria.';
    if (!datos.tipoDocumento) nuevosErrores.tipoDocumento = 'El tipo de documento es obligatorio.';
    if (!datos.solicitud) nuevosErrores.solicitud = 'La solicitud es obligatoria.';
    if (!datos.dni) nuevosErrores.dni = 'El DNI es obligatorio.';
    if (!datos.nombre) nuevosErrores.nombre = 'El nombre es obligatorio.';

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      const res = await fetch(`/api/editar/${documento.numeroSerie}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data.mensaje);
      router.push('/documentos');
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMensaje(`Error al registrar: ${error.message}`);
    }
  }, [datos, router, documento.numeroSerie]);

  if (!documento) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <style jsx>{`
        form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 10px;
          width: 600px;
          margin: 0 auto;
        }
        label {
          margin-bottom: 5px;
          display: block;
        }
        input,
        select {
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          grid-column: span 2;
        }
        .error {
          color: red;
          margin-top: -5px;
          margin-bottom: 10px;
        }
        h1 {
          text-align: center;
        }
        .gender {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          grid-column: span 2;
        }
        .gender label {
          display: inline-flex;
          align-items: center;
        }
        .gender input[type='radio'] {
          margin-right: 5px;
          width: auto;
        }
      `}</style>
      <h1>Editar Documento</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="numeroSerie">Número de Serie:</label>
          <input type="text" id="numeroSerie" name="numeroSerie" value={datos.numeroSerie} onChange={handleChange} required />
          {errores.numeroSerie && <p className="error">{errores.numeroSerie}</p>}
        </div>
        <div>
          <label htmlFor="fechaEmision">Fecha de Emisión:</label>
          <input type="date" id="fechaEmision" name="fechaEmision" value={datos.fechaEmision} onChange={handleChange} required />
          {errores.fechaEmision && <p className="error">{errores.fechaEmision}</p>}
        </div>
        <div>
          <label htmlFor="tipoDocumento">Tipo de Documento:</label>
          <input type="text" id="tipoDocumento" name="tipoDocumento" value={datos.tipoDocumento} onChange={handleChange} required />
          {errores.tipoDocumento && <p className="error">{errores.tipoDocumento}</p>}
        </div>
        <div>
          <label htmlFor="solicitud">Solicitud:</label>
          <input type="text" id="solicitud" name="solicitud" value={datos.solicitud} onChange={handleChange} required />
          {errores.solicitud && <p className="error">{errores.solicitud}</p>}
        </div>
        <div>
          <label htmlFor="dni">DNI:</label>
          <input type="text" id="dni" name="dni" value={datos.dni} onChange={handleChange} required />
          {errores.dni && <p className="error">{errores.dni}</p>}
        </div>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={handleChange} required />
          {errores.nombre && <p className="error">{errores.nombre}</p>}
        </div>
        <div>
          <label htmlFor="foto">Foto:</label>
          <input type="file" id="foto" name="foto" accept="image/*" onChange={handleChange}  />
          {errores.foto && <p className="error">{errores.foto}</p>}
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const prisma = new PrismaClient();
  const documento = await prisma.documento.findUnique({
    where: {
      numeroSerie: params.numeroSerie,
    },
  });

  if (!documento) {
    return {
      props: {
        documento: null,
      },
    };
  }

  return {
    props: {
      documento: JSON.parse(JSON.stringify(documento)),
    },
  };
}

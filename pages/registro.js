import { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Registro() {
  const [datos, setDatos] = useState({
    numeroSerie: '',
    fechaEmision: '',
    tipoDocumento: '',
    solicitud: '',
    dni: '',
    nombre: '',
    foto: null,
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setDatos(prevDatos => ({
      ...prevDatos,
      [name]: files ? files[0] : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!datos.numeroSerie) nuevosErrores.numeroSerie = 'El número de serie es obligatorio.';
    if (!datos.fechaEmision) nuevosErrores.fechaEmision = 'La fecha de emisión es obligatoria.';
    if (!datos.tipoDocumento) nuevosErrores.tipoDocumento = 'El tipo de documento es obligatorio.';
    if (!datos.solicitud) nuevosErrores.solicitud = 'La solicitud es obligatoria.';
    if (!datos.dni) nuevosErrores.dni = 'El DNI es obligatorio.';
    if (!datos.nombre) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!datos.foto) nuevosErrores.foto = 'La foto es obligatoria.';

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('numeroSerie', datos.numeroSerie);
    formData.append('fechaEmision', datos.fechaEmision);
    formData.append('tipoDocumento', datos.tipoDocumento);
    formData.append('solicitud', datos.solicitud);
    formData.append('dni', datos.dni);
    formData.append('nombre', datos.nombre);
    formData.append('foto', datos.foto);

    try {
      const res = await fetch('/api/registrar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data.mensaje);
      router.push('/');
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMensaje(`Error al registrar: ${error.message}`);
    }
  }, [datos, router]);

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
      <h1>Registro de Documento</h1>
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
          <select id="tipoDocumento" name="tipoDocumento" value={datos.tipoDocumento} onChange={handleChange} required>
            <option value="">Seleccione un tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="CE">CE</option>
            <option value="LE">LE</option>
            <option value="RUC">RUC</option>
          </select>
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
          <input type="file" id="foto" name="foto" accept="image/*" onChange={handleChange} required />
          {errores.foto && <p className="error">{errores.foto}</p>}
        </div>
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </Layout>
  );
}

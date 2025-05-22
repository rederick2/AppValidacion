import QRCode from 'qrcode'

export default function Detalle({ documento, qr }) {
  if (!documento) return <p>No encontrado</p>

  return (
    <div className="contenedor">
      <style jsx>{`
        .contenedor {
          max-width: 900px;
          margin: 30px auto;
          border: 1px solid #ccc;
          padding: 20px;
          font-family: sans-serif;
        }

        .cabecera {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .mensaje-ok {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
          padding: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .mensaje-ok::before {
          content: '✅';
          margin-right: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        td {
          padding: 10px;
          vertical-align: top;
          border-bottom: 1px dotted #ccc;
        }

        .etiqueta {
          width: 220px;
          background-color: #103f77;
          color: white;
          font-weight: bold;
        }

        .foto {
          width: 120px;
          height: auto;
          border: 1px solid #ccc;
        }

        .qr {
          width: 120px;
        }
      `}</style>

      <div className="cabecera">
        <div>
          <div><strong>Número de serie</strong></div>
          <div>{documento.numeroSerie}</div>
        </div>
        <div>
          <div><strong>Fecha de emisión</strong></div>
          <div>{new Date(documento.fechaEmision).toLocaleDateString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric'
          })}</div>
        </div>
      </div>

      <div className="mensaje-ok">
        El presente documento ha sido emitido por el RENIEC.
      </div>

      <table>
        <tbody>
          <tr>
            <td className="etiqueta">Tipo de documento emitido</td>
            <td>{documento.tipoDocumento}</td>
            <td rowSpan="7" style={{ textAlign: 'center' }}>
              <img
                src={documento.fotoUrl}
                className="foto"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/images/placeholder.png"
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="etiqueta">Solicitud N°</td>
            <td>{documento.solicitud}</td>
          </tr>
          <tr>
            <td className="etiqueta">DNI del solicitante</td>
            <td>{documento.dni}</td>
          </tr>
          <tr>
            <td className="etiqueta">Nombre del solicitante</td>
            <td>{documento.nombre}</td>
          </tr>
          <tr>
            <td className="etiqueta">DNI del titular</td>
            <td>{documento.dni}</td>
          </tr>
          <tr>
            <td className="etiqueta">Nombre del titular</td>
            <td>{documento.nombre}</td>
          </tr>
          <tr>
            <td className="etiqueta">Código QR</td>
            <td><img src={qr} className="qr" alt="QR" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  const documento = await prisma.documento.findUnique({
    where: { numeroSerie: params.numeroSerie }
  })

  if (!documento) return { props: { documento: null } }

  const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${host}/verificacion/${documento.numeroSerie}`
  const qr = await QRCode.toDataURL(url)

  const documentoSerializado = {
    ...documento,
    fechaEmision: documento.fechaEmision.toISOString(),
  }

  return { props: { documento: documentoSerializado, qr } }
}

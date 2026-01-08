import { jsPDF } from "jspdf";
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/*
1. Numero de albaran (se introduce en el formulario)
2. Informacion del cliente (se obtiene por parametros)
3. Fecha (se obtiene la fecha actual del sistema)
4. Pedido del cliente (se introduce en el formulario)
5. Articulos (se obtiene por parametros)
  5.1 Codígo (manual, se introduce en el formulario)
  5.2 Descripción (se obtiene por parametros)
  5.3 Cantidad (se introduce en el formulario)
  5.4 Serial (se introduce en el formulario)
  5.5 Revision (OK)
  5.6 Firma OK (Según login del usuario, se obtiene del contexto de sesión)
*/


export default function GeneradorAlbaranPDF({albaranNumber, client, clientOrderNumber, clientOrderGlobal }) {
  // 1. Numero de albaran (se introduce en el formulario)
  const numeroAlbaran = albaranNumber;


  // 2. Informacion del cliente (se obtiene por parametros)
  const cliente = {
    razonSocial: client.vatNumber,
    rfc : client.vatName,
    direccion: client.deliveryAddress,
    codigoPostal: client.deliveryZipCode,
    ciudad: client.deliveryCity,
    estado: client.deliveryState
  }

  const globaltik = {
    direccion: "FUNDIDORES NO. 57 TRABAJADORES DEL HIERRO",
    ciudad: "AZCAPOTZALCO, CIUDAD DE MEXICO",
    estado: "CIUDAD DE MEXICO",
    codigoPostal: "02650",
    telefono: "55 62188715",
    email: "nahum.jaime@globalelectrik.com"
  }

  // 3. Fecha (se obtiene la fecha actual del sistema)
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

  // 4. Pedido del cliente (se introduce en el formulario)
  const pedidoCliente = "OC-ING-8371"
  const pedidodGlobal = "250047"

  // 5. Articulos (se obtiene por parametros)
  const materials = [
    {
      codigo: "REF-02647", // manual, se introduce en el formulario
      descripcion: "TUBO DE PVC", // se obtiene por parametros
      cantidad: 10, // se introduce en el formulario
      serial: "1234567890", // se introduce en el formulario
      revision: "OK",
      firma: "Firma del usuario" // Según login del usuario, se obtiene del contexto de sesión
    },
    {
      codigo: "REF-11232",
      descripcion: "TORNILLOS",
      cantidad: 5,
      serial: "0987654321",
      revision: "OK",
      firma: "Firma del usuario"
    }
  ];

  // Generar el PDF
  const generarPDF = () => {
    // Crear documento tamaño A4
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });

    // Márgenes y estilos
    const margin = 15;
    let y = margin;
    doc.setFontSize(20);
    doc.text('ALBARÁN', 105, y, { align: 'center' });
    y += 12;

    // Datos de la empresa (globaltik)
    doc.setFontSize(10);
    doc.text('GLOBAL ELECTRIK', margin, y);
    doc.text(`Dirección: ${globaltik.direccion}`, margin, y + 5);
    doc.text(`Ciudad: ${globaltik.ciudad}`, margin, y + 10);
    doc.text(`Estado: ${globaltik.estado}`, margin, y + 15);
    doc.text(`C.P.: ${globaltik.codigoPostal}`, margin, y + 20);
    doc.text(`Tel: ${globaltik.telefono}`, margin, y + 25);
    doc.text(`Email: ${globaltik.email}`, margin, y + 30);

    // Datos del cliente
    let xCliente = 120;
    doc.setFontSize(10);
    doc.text('Cliente:', xCliente, y);
    doc.text(`Razón Social: ${cliente.razonSocial}`, xCliente, y + 5);
    doc.text(`RFC: ${cliente.rfc}`, xCliente, y + 10);
    doc.text(`Dirección: ${cliente.direccion}`, xCliente, y + 15);
    doc.text(`Ciudad: ${cliente.ciudad}`, xCliente, y + 20);
    doc.text(`Estado: ${cliente.estado}`, xCliente, y + 25);
    doc.text(`C.P.: ${cliente.codigoPostal}`, xCliente, y + 30);

    y += 40;
    doc.setFontSize(12);
    doc.text(`Número de Albarán: ${numeroAlbaran}`, margin, y);
    doc.text(`Fecha: ${fechaFormateada}`, 150, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Pedido del Cliente: ${pedidoCliente}`, margin, y);
    doc.text(`Pedido Global: ${pedidodGlobal}`, 150, y);

    // Línea separadora
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(margin, y, 210 - margin, y);
    y += 6;

    // Tabla de artículos
    doc.setFontSize(11);
    doc.text('Artículos:', margin, y);
    y += 6;
    doc.setFontSize(8);
    // Encabezados
    doc.text('Código', margin, y);
    doc.text('Descripción', margin + 30, y);
    doc.text('Cantidad', margin + 100, y);
    doc.text('Serial', margin + 120, y);
    doc.text('Revisión', margin + 150, y);
    doc.text('Firma', margin + 170, y);
    y += 5;
    doc.setLineWidth(0.1);
    doc.line(margin, y, 210 - margin, y);
    y += 6;
    // Filas
    articulos.forEach((articulo) => {
      doc.text(articulo.codigo, margin, y);
      doc.text(articulo.descripcion, margin + 30, y);
      doc.text(String(articulo.cantidad), margin + 100, y);
      doc.text(articulo.serial, margin + 120, y);
      doc.text(articulo.revision, margin + 150, y);
      doc.text(articulo.firma, margin + 170, y);
      y += 10;
    });

    // Guardar el PDF
    doc.save('albaran.pdf');
  };

  return (
    <div>
      <h1>Generador de Albarán PDF</h1>
      <button
        onClick={generarPDF} 
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CheckCircleIcon aria-hidden="true" className="-ml-0.5 size-5" />
        Generar PDF
      </button>
    </div>
  );
}
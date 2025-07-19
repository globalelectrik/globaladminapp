import { jsPDF } from "jspdf";

/*
1. Numero de albaran (se introduce en el formulario)
2. Informacion del client (se obtiene por parametros)
3. Fecha (se obtiene la fecha actual del sistema)
4. Pedido del client (se introduce en el formulario)
5. Articulos (se obtiene por parametros)
  5.1 Codígo (manual, se introduce en el formulario)
  5.2 Descripción (se obtiene por parametros)
  5.3 Cantidad (se introduce en el formulario)
  5.4 Serial (se introduce en el formulario)
  5.5 Revision (OK)
  5.6 Firma OK (Según login del usuario, se obtiene del contexto de sesión)
*/

const globatik = {
  address: "FUNDIDORES NO. 57 TRABAJADORES DEL HIERRO",
  ciudad: "AZCAPOTZALCO, CIUDAD DE MEXICO",
  estado: "CIUDAD DE MEXICO",
  codigoPostal: "02650",
  telefono: "55 62188715",
  email: "nahum.jaime@globalelectrik.com"
}

export function generarPDF({
  numeroAlbaran,
  client,
  formattedDate,
  pedidoCliente,
  pedidodGlobal,
  articulos
}) {

  console.log("articulos-->>", articulos);

  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  const margin = 15;
  let y = margin;
  doc.setFontSize(20);
  doc.text('ALBARÁN', 105, y, { align: 'center' });
  y += 12;

  // Datos de la empresa (globatik)
  doc.setFontSize(10);
  doc.text('GLOBAL ELECTRIK', margin, y);
  doc.text(`Dirección: ${globatik.address}`, margin, y + 5);
  doc.text(`Ciudad: ${globatik.ciudad}`, margin, y + 10);
  doc.text(`Estado: ${globatik.estado}`, margin, y + 15);
  doc.text(`C.P.: ${globatik.codigoPostal}`, margin, y + 20);
  doc.text(`Tel: ${globatik.telefono}`, margin, y + 25);
  doc.text(`Email: ${globatik.email}`, margin, y + 30);

  // Datos del client
  let xCliente = 120;
  doc.setFontSize(10);
  doc.text('Cliente:', xCliente, y);
  doc.text(`Razón Social: ${client.vatName}`, xCliente, y + 5);
  doc.text(`RFC: ${client.vatNumber }`, xCliente, y + 10);
  doc.text(`Dirección: ${client.deliveryAddress}`, xCliente, y + 15);
  doc.text(`Ciudad: ${client.deliveryCity}`, xCliente, y + 20);
  doc.text(`Estado: ${client.deliveryState}`, xCliente, y + 25);
  doc.text(`C.P.: ${client.deliveryZipCode}`, xCliente, y + 30);

  y += 40;
  doc.setFontSize(12);
  doc.text(`Número de Albarán: ${numeroAlbaran}`, margin, y);
  doc.text(`Fecha: ${formattedDate}`, 150, y);
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
  doc.setFontSize(10);
  // Encabezados
  doc.text('Código', margin, y);
  doc.text('Descripción', margin + 30, y);
  doc.text('Cantidad', margin + 100, y);
  doc.text('Serial', margin + 120, y);
  doc.text('Revisión', margin + 150, y);
  doc.text('Firma', margin + 175, y);
  y += 5;
  doc.setLineWidth(0.1);
  doc.line(margin, y, 210 - margin, y);
  y += 5;
  // Filas
  articulos.forEach((articulo) => {
    doc.text(articulo.materialClientReference, margin, y);
    doc.text(articulo.materialName, margin + 30, y);
    doc.text(String(articulo.quantity), margin + 100, y);
    doc.text(articulo.serial, margin + 120, y);
    doc.text(articulo.revision, margin + 150, y);
    doc.text(articulo.firma, margin + 175, y);
    y += 7;
  });

  // Guardar el PDF
  doc.save('albaran.pdf');
}
import { jsPDF } from "jspdf";

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
  materials
}) {

  console.log('🔍 PDF Generation - Full params:', materials);

  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm for A4
  const margin = 15;
  let y = margin;
  
  doc.setFontSize(20);
  doc.text('ALBARÁN', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Datos de la empresa (globatik)
  doc.setFontSize(10);
  doc.text('Globatik®', margin, y);
  doc.text(`Dirección: ${globatik.address}`, margin, y + 5);
  doc.text(`Ciudad: ${globatik.ciudad}`, margin, y + 10);
  doc.text(`Estado: ${globatik.estado}`, margin, y + 15);
  doc.text(`C.P.: ${globatik.codigoPostal}`, margin, y + 20);
  doc.text(`Tel: ${globatik.telefono}`, margin, y + 25);
  doc.text(`Email: ${globatik.email}`, margin, y + 30);

  // Datos del cliente
  let xCliente = 120;
  doc.setFontSize(10);
  doc.text('Cliente:', xCliente, y);
  doc.text(`Razón Social: ${client.vatName}`, xCliente, y + 5);
  doc.text(`RFC: ${client.vatNumber}`, xCliente, y + 10);
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
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ✅ Simplified table with fixed column positions
  doc.setFontSize(9);
  
  // Column X positions (in mm from left edge)
  const colX = {
    codigo: 15,        // Código
    descripcion: 35,   // Descripción  
    referencia: 90,    // Referencia ✅
    cantidad: 120,     // Cantidad
    serial: 140,       // Serial
    revision: 165,     // Revisión
    firma: 185         // Firma
  };

  // ✅ Draw table headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Código', colX.codigo, y);
  doc.text('Descripción', colX.descripcion, y);
  doc.text('Referencia', colX.referencia, y); // ✅ This should appear
  doc.text('Cantidad', colX.cantidad, y);
  doc.text('Serial', colX.serial, y);
  doc.text('Revisión', colX.revision, y);
  doc.text('Firma', colX.firma, y);
  
  y += 2;
  doc.setLineWidth(0.1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // ✅ Draw table rows
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  
  materials.forEach((articulo, index) => {
    console.log(`🔍 Material ${index}:`, articulo);
    
    const codigo = String(articulo.materialClientReference || '-');
    const descripcion = String(articulo.materialName || '-');
    const referencia = String(articulo.materialReference || 'N/A'); // ✅ Different fallback
    const cantidad = String(articulo.quantity || '0');
    const serial = String(articulo.serial || '-');
    const revision = String(articulo.revision || '-');
    const firma = String(articulo.firma || '-');

    console.log(`  📝 Referencia value: "${referencia}"`);
    console.log(`  📝 Position: x=${colX.referencia}, y=${y}`);

    // ✅ Draw each cell explicitly
    doc.text(codigo, colX.codigo, y);
    
    // Truncate description if too long
    const maxDescLength = 25;
    const shortDesc = descripcion.length > maxDescLength 
      ? descripcion.substring(0, maxDescLength) + '...' 
      : descripcion;
    doc.text(shortDesc, colX.descripcion, y);
    
    // ✅ EXPLICITLY draw referencia
    doc.text(referencia, colX.referencia, y);
    
    doc.text(cantidad, colX.cantidad, y);
    doc.text(serial, colX.serial, y);
    doc.text(revision, colX.revision, y);
    doc.text(firma, colX.firma, y);
    
    y += 7;
    
    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
  });

  // Guardar el PDF
  const filename = `Albarán-${numeroAlbaran}.pdf`;
  console.log('💾 Saving PDF as:', filename);
  doc.save(filename);
}
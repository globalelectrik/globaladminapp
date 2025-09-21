// utils/generateDeliveryInstructions.js
import jsPDF from "jspdf";

export function generateDeliveryInstrucionsPDF(orderSelected) {
  if (!orderSelected) return;

  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INSTRUCCIONES DE ENTREGA", 105, 20, { align: "center" });

  doc.setFontSize(12);
  let y = 20; 
  const lineSpacing = 7;

  // Helper
  const addLine = (label, value = "") => {
    y += lineSpacing;
    const line = `${label} ${value}`;
    doc.text(line, 105, y, { align: "center" });
  };

  // Data
  addLine("Orden:", orderSelected.orderNumGlobal || "");
  addLine("PARA:", orderSelected.vatName || "");
  addLine("EN ATENCIÓN A:", orderSelected.deliveryAddress?.deliveryContact?.contactName || "");
  addLine("TELÉFONO:", orderSelected.deliveryAddress?.deliveryContact?.mobile || "");
  addLine("ENTREGAR EN:", orderSelected.deliveryAddress?.aliasDeliveryAddress || "");
  addLine(orderSelected.deliveryAddress?.deliveryAddress || "");
  addLine("Ciudad/Municipio:", orderSelected.deliveryAddress?.deliveryCity || "");
  addLine("Estado:", orderSelected.deliveryAddress?.deliveryState || "");
  addLine("Código Postal:", orderSelected.deliveryAddress?.deliveryZipCode || "");

  // Divider
  y += lineSpacing;

  // Contact info
  doc.setFont("helvetica", "bold");
  doc.text("Envía:", 105, y, { align: "center" });

  doc.setFont("helvetica", "normal");
  y += lineSpacing;
  doc.text("GLOBAL ELECTRIK AUTOMATIZACION SOSTENIBLE SA DE CV", 105, y, { align: "center" });
  y += lineSpacing;
  doc.text("Nahum Jaime Sánchez", 105, y, { align: "center" });
  y += lineSpacing;
  doc.text("Tel: 5562188715", 105, y, { align: "center" });
  doc.setFont("helvetica", "bold");
  y += lineSpacing;
  doc.text("ALBARÁN DE ENTREGA Y FACTURA DENTRO DE LA CAJA", 105, y, { align: "center" });

  
  // Save
  doc.save(`InstruccionesEntrega_${orderSelected.orderNumGlobal || "orden"}.pdf`);
}

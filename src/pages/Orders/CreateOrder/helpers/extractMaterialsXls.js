import * as XLSX from 'xlsx';

export const extractMaterialsXls = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const extractedMaterials = [];
    let rowIndex = 10; // Starting from row 10 (B10, C10, F10, M10)
    
    while (true) {
      // Get values from specific cells
      const referenciaCell = `B${rowIndex}`;
      const materialNameCell = `C${rowIndex}`;
      const quantityCell = `F${rowIndex}`;
      const salePriceCell = `M${rowIndex}`;
      
      const referencia = worksheet[referenciaCell]?.v;
      const materialName = worksheet[materialNameCell]?.v;
      const quantity = worksheet[quantityCell]?.v;
      const salePrice = worksheet[salePriceCell]?.v;
      
      // If no reference or material name, assume we've reached the end
      if (!referencia && !materialName) {
        break;
      }
      
      // Only add if we have at least reference and material name
      if (referencia || materialName) {
        const material = {
          materialReference: referencia || '',
          materialName: materialName || '',
          quantity: quantity || 0,
          salePrice: salePrice || 0,
          // Default values for required fields
          materialBrand: '',
          materialClassification: '',
          materialStatusType: 'Nuevo',
          materialClientReference: 'X',
          id: Date.now() + Math.random() // Temporary ID for the table
        };
        
        extractedMaterials.push(material);
      }
      
      rowIndex++;
      
      // Safety check to prevent infinite loop
      if (rowIndex > 1000) {
        break;
      }
    }
    
    return {
      success: true,
      materials: extractedMaterials,
      count: extractedMaterials.length
    };
    
  } catch (error) {
    console.error('Error extracting materials from Excel:', error);
    return {
      success: false,
      error: error.message,
      materials: []
    };
  }
};
import { formatCurrency } from './../../../../../utils/helpers/formatCurrency';

export default function OrderMaterialsTable({
  orderSelected,
  setOrderSelected,
  setOpenEditRowModal,
  setSelectedMaterialRow,
  setEditMaterialIndex
}) {
  const handleRowClick = (mat, index) => {
    setSelectedMaterialRow(mat);
    setEditMaterialIndex(index)
    setOpenEditRowModal(true);
  };


  const getPendingQuantity = (materialRow) => {
    const orderedQuantity = materialRow.quantity;
    const materialId = materialRow.material.id
  
    // Sum up the purchasing quantities in the order's purchases that match this material
    const purchasedQuantity = orderSelected.purchases
      ?.map(p => p) // extract populated purchase objects
      ?.filter(p => p?.material?.id === materialId)
      ?.reduce((sum, p) => sum + (p?.purchasingQuantity || 0), 0) || 0;
  
    return orderedQuantity - purchasedQuantity;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700">
          <tr>
            <th className="px-6 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">Material</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Cant.</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Precio Unitario</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">PorComprar</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">RefMaterial</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Marca</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orderSelected?.materials?.map((mat, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-1 text-sm text-gray-900 font-medium">{mat?.material?.materialName || mat?.material}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.quantity}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{formatCurrency(mat?.salePrice)}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{getPendingQuantity(mat)}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.material?.materialReference}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.material?.materialBrand?.brandName}</td>
              <td className="px-6 py-1 text-center">
                <button 
                  onClick={() => handleRowClick(mat, index)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  Editar
                </button>
              </td>          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function OrderMaterialsPurchasesTable({
  orderSelected,
  setOrderSelected,
  setOpenPuchaseRowModal,
  setSelectedPurchaseRow,
  setEditPurchaseIndex
}) {
  const handleRowClick = (mat, index) => {
    setSelectedPurchaseRow(mat);
    setEditPurchaseIndex(index)
    setOpenPuchaseRowModal(true);
  };

 // console.log("orderSelected-->> ",orderSelected);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700">
          <tr>
            <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Material</th>
            <th className="px-6 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">Cant.</th>
            <th className="px-6 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">Tipo Proveedor</th>
            <th className="px-6 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">En Almacén</th>
            <th className="px-6 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider">Enviado al cliente</th>
            <th className="px-6 py-2 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-lg">Detalles</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orderSelected?.purchases?.map((mat, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-1 text-sm text-gray-900 font-medium">{mat?.material?.materialName || mat?.material}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.purchasingQuantity}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.supplierType}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.deliveredToWarehouse ? "SI" : "NO"}</td>
              <td className="px-6 py-1 text-sm text-gray-900 text-center">{mat?.deliveredToWarehouse ? "SI" : "NO"}</td>
              <td className="px-6 py-1 text-center">
                <button 
                  onClick={() => handleRowClick(mat, index)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  Ver
                </button>
              </td>          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
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

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full table-auto border rounded-md overflow-hidden text-sm">
        <thead className="bg-indigo-600 text-center text-slate-50">
          <tr>
            <th className="px-4 py-1 border-b font-medium">Material</th>
            <th className="px-4 py-1 border-b font-medium">Cant.</th>
            <th className="px-4 py-1 border-b font-medium">Tipo Proveedor</th>
            <th className="px-4 py-1 border-b font-medium">En Almacén</th>
            <th className="px-4 py-1 border-b font-medium rounded-tr-md">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {orderSelected?.purchases?.map((mat, index) => (
            <tr key={index} className="hover:bg-gray-200 cursor-pointer">
              <td className="px-4 py-2 border-b text-center" >{mat?.purchase?.material?.materialName || mat?.material}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.purchase?.purchasingQuantity}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.purchase?.supplierType}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.purchase?.deliveredToWarehouse ? "SI" : "NO"}</td>
              <td className="px-4 py-2 border-b text-center text-indigo-600" onClick={() => handleRowClick(mat, index)} >Ver</td>          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
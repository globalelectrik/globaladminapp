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
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full table-auto border rounded-md overflow-hidden text-sm">
        <thead className="bg-indigo-600 text-center text-slate-50">
          <tr>
            <th className="px-4 py-1 border-b font-medium">Material</th>
            <th className="px-4 py-1 border-b font-medium">Cant.</th>
            <th className="px-4 py-1 border-b font-medium">PorComprar</th>
            <th className="px-4 py-1 border-b font-medium">RefMaterial</th>
            <th className="px-4 py-1 border-b font-medium">Marca</th>
            <th className="px-4 py-1 border-b font-medium rounded-tr-md">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orderSelected?.materials?.map((mat, index) => (
            <tr key={index} className="hover:bg-gray-200 cursor-pointer">
              <td className="px-4 py-2 border-b text-left" >{mat?.material?.materialName || mat?.material}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.quantity}</td>
              <td className="px-4 py-2 border-b text-center">  {getPendingQuantity(mat)}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.material?.materialReference}</td>
              <td className="px-4 py-2 border-b text-center text-xs">{mat?.material?.materialBrand?.brandName}</td>
              <td className="px-4 py-2 border-b text-center text-indigo-600" onClick={() => handleRowClick(mat, index)} >Editar</td>          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
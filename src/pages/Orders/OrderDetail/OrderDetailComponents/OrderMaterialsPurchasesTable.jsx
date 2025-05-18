export default function OrderMaterialsPurchasesTable({
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

  const handleShowPurchasing = () => {
    console.log("show");
  }

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full table-auto border rounded-md overflow-hidden text-sm">
        <thead className="bg-indigo-600 text-center text-slate-50">
          <tr>
            <th className="px-4 py-1 border-b font-medium">Material</th>
            <th className="px-4 py-1 border-b font-medium">Cant.</th>
            <th className="px-4 py-1 border-b font-medium rounded-tr-md">Seguimiento</th>
          </tr>
        </thead>
        <tbody>
          {orderSelected?.materials?.map((mat, index) => (
            <tr key={index} className="hover:bg-gray-200 cursor-pointer">
              <td className="px-4 py-2 border-b text-center" >{mat?.material?.materialName || mat?.material}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.quantity}</td>
              <td className="px-4 py-2 border-b text-center text-indigo-600" onClick={() => handleRowClick(mat, index)} >Editar</td>          
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
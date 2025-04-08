export default function OrderMaterialsTable({
  orderSelected,
  setOrderSelected,
  setOpenEditRowModal,
  setSelectedMaterialRow,
}) {
  const handleRowClick = (mat) => {
    setSelectedMaterialRow(mat);
    setOpenEditRowModal(true);
  };

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full table-auto border rounded-md overflow-hidden text-sm">
        <thead className="bg-indigo-600 text-center text-slate-50">
          <tr>
            <th className="px-4 py-2 border-b font-medium rounded-tl-md">Material</th>
            <th className="px-4 py-2 border-b font-medium">Referencia</th>
            <th className="px-4 py-2 border-b font-medium">Cant.</th>
            <th className="px-4 py-2 border-b font-medium">Entregado</th>
            <th className="px-4 py-2 border-b font-medium">Comprado</th>
            <th className="px-4 py-2 border-b font-medium rounded-tr-md">Enlace Compra</th>
          </tr>
        </thead>
        <tbody>
          {orderSelected?.materials?.map((mat, index) => (
            <tr
              key={index}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => handleRowClick(mat)}
            >
              <td className="px-4 py-2 border-b">{mat?.material?.materialName || mat?.material}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.material?.materialReference ?? 'N/A'}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.quantity}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.delivered ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.purchased ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2 border-b text-center">{mat?.purchasedLink}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useEffect, useState } from 'react';

export default function EditOrderMaterialRow({
  isOpen,
  onClose,
  materialData,
  orderSelected,
  setOrderSelected,
  saveOrderChanges
}) {
  const [editedRow, setEditedRow] = useState(null);

  useEffect(() => {
    if (materialData) {
      setEditedRow({ ...materialData });
    }
  }, [materialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedRow((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // Update materials in orderSelected
    const updatedMaterials = orderSelected.materials.map((mat) =>
      mat._id === editedRow._id ? editedRow : mat
    );

    setOrderSelected({
      ...orderSelected,
      materials: updatedMaterials,
    });

    onClose(); // Close modal after saving
  };

  if (!isOpen || !editedRow) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Editar Material</h2>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={editedRow.quantity}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">¿Entregado?</label>
            <input
              type="checkbox"
              name="delivered"
              checked={editedRow.delivered}
              onChange={handleChange}
              className="ml-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">¿Comprado?</label>
            <input
              type="checkbox"
              name="purchased"
              checked={editedRow.purchased}
              onChange={handleChange}
              className="ml-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Enlace de Compra</label>
            <input
              type="text"
              name="purchasedLink"
              value={editedRow.purchasedLink || ''}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={()=>saveOrderChanges()} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react'; import { Link } from 'react-router-dom';

export default function EditOrderMaterialRow({ 
    isOpen, 
    onClose, 
    selectedMaterialRow, 
    setSelectedMaterialRow,
    orderSelected,
    setOrderSelected,
    saveMaterialOrderChanges,
    editMaterialIndex 
  }) { 
      

const handleChange = (e) => { 
  const { name, value } = e.target; setSelectedMaterialRow((prev) => ({ ...prev, [name]: value, })); };

if (!isOpen || !selectedMaterialRow) return null;

return ( 
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"> <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-2"> 
    <h2 className="text-lg font-bold">Editar Material</h2>
      <div className="space-y-2">
            <div className='flex justify-between gap-4'>
              <div className="flex-1">
                <label className="block text-sm font-medium">Referencia</label>
                <p className="px-3 py-1 border rounded bg-gray-100">
                  {selectedMaterialRow.material?.materialReference}
                </p>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Nombre del Material</label>
                <p className="px-3 py-1 border rounded bg-gray-100">
                  {selectedMaterialRow.material?.materialName}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Cantidad</label>
              <input
                type="number"
                name="quantity"
                value={selectedMaterialRow.quantity}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
             <div>
              <label className="block text-sm font-medium">Precio Venta Unitario</label>
              <input
                type="number"
                name="salePrice"
                value={selectedMaterialRow.salePrice}
                onChange={handleChange}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <div>
              <Link
                className="text-indigo-600 underline underline-offset-2"
                to={`/materials/materialDetail/${selectedMaterialRow.material.id}`}
              >
                Avanzado
              </Link>
            </div>
            <div className="flex space-x-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                Cancelar
              </button>
              <button
                onClick={saveMaterialOrderChanges}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

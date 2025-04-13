import React, { useEffect, useState } from 'react'; import { Link } from 'react-router-dom';

export default function EditOrderMaterialRow({ 
    isOpen, onClose, materialData, saveMaterialOrderChanges }) { 
      
const [editedRow, setEditedRow] = useState(null);

useEffect(() => { 
  if (materialData) { 
    setEditedRow({ ...materialData }); } 
  }, [materialData]);

const handleAddSerial = () => { 
  setEditedRow((prev) => (
    { ...prev, materialSerialNumber: [ ...(prev.materialSerialNumber || []), { serialNumber: '' } ], }));
   };

const handleChangeSerial = (index, value) => { 
  const updated = [...(editedRow.materialSerialNumber || [])]; 
  updated[index].serialNumber = value; setEditedRow((prev) => ({ ...prev, materialSerialNumber: updated, })); };

const handleRemoveSerial = (index) => { 
  const updated = [...(editedRow.materialSerialNumber || [])]; updated.splice(index, 1); 
  setEditedRow((prev) => ({ ...prev, materialSerialNumber: updated, })); };

const handleChange = (e) => { 
  const { name, value } = e.target; setEditedRow((prev) => ({ ...prev, [name]: value, })); };

if (!isOpen || !editedRow) return null;

return ( 
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"> <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-2"> 
    <h2 className="text-lg font-bold">Editar Material</h2>
      <div className="space-y-2">
            <div className='flex justify-between gap-4'>
              <div className="flex-1">
                <label className="block text-sm font-medium">Referencia</label>
                <p className="px-3 py-1 border rounded bg-gray-100">
                  {editedRow.material?.materialReference}
                </p>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Nombre del Material</label>
                <p className="px-3 py-1 border rounded bg-gray-100">
                  {editedRow.material?.materialName}
                </p>
              </div>
            </div>

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
              <label className="block text-sm font-medium">Números de Serie</label>
              <div className="space-y-2">
                {(editedRow.materialSerialNumber || []).map((entry, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input
                      type="text"
                      value={entry.serialNumber}
                      onChange={(e) => handleChangeSerial(idx, e.target.value)}
                      className="flex-1 px-3 py-1 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSerial(idx)}
                      className="text-red-500 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSerial}
                  className="text-sm text-indigo-600 mt-1"
                >
                  + Agregar número de serie
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <div>
              <Link
                className="text-indigo-600"
                to={`/materials/materialDetail/${editedRow.material.id}`}
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

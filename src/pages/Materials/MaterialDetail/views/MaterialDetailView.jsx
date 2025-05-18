import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet.jsx';
import usePut from '../../../../hooks/usePut/usePut.jsx';

export default function MaterialDetailView() {
  const { id } = useParams();
  const [materialSelected, setMaterialSelected] = useState("");

  const {
    putResponse: materialUpdatedData,
    isLoading: materialUpdateIsLoading,
    error: materialUpdateError,
    fetchPut: materialUpdateFetchPut,
  } = usePut();

  const {
    data: materialData,
    isLoading: materialIsLoading,
    error: materialError,
    fetchGet: materialFetchGet,
  } = useGet();

  useEffect(() => {
    materialFetchGet(`/materials/materialDetail/${id}`);
  }, []);

  useEffect(() => {
    if (materialData) {
      setMaterialSelected(materialData.materials);
    }
  }, [materialData]);

   useEffect(() => {
    if (materialUpdatedData) {
      setMaterialSelected(materialData.material);
    }
  }, [materialUpdatedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialSelected((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSave = async () => {
    await materialUpdateFetchPut(`/materials/materialUpdate/${id}`, materialSelected);
  };


  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Editar Material</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nombre del Material</label>
          <input
            name="materialName"
            value={materialSelected?.materialName ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Referencia</label>
          <input
            name="materialReference"
            value={materialSelected?.materialReference ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            name="materialStatusType"
            value={materialSelected?.materialStatusType ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seleccione</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Reacondicionado">Reacondicionado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Referencia Cliente</label>
          <input
            name="materialClientReference"
            value={materialSelected?.materialClientReference ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        

        <div>
          <label className="block text-sm font-medium">Marca</label>
          <p
            name="materialBrand"
            value={materialSelected?.materialBrand?.id || ''}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          >{materialSelected?.materialBrand?.brandName}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Clasificación</label>
          <p
            name="materialClassification"
            value={materialSelected?.materialClassification?.id || ''}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          >{materialSelected?.materialClassification?.classificationName}</p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          disabled={materialUpdateIsLoading}
        >
          {materialUpdateIsLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        {materialUpdateError && (
          <p className="text-red-600 mt-2">Error: {materialUpdateError.message}</p>
        )}
      </div>
    </div>
  );
}

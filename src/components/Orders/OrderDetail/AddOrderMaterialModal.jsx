import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react"; // puedes usar modal propio si no usas HeadlessUI
import useGet from "../../../hooks/useGet/useGet";
import usePost from './../../../hooks/usePost/usePost';
import usePut from "../../../hooks/usePut/usePut";

export default function AddOrderMaterialModal({ isOpen, onClose, orderSelected, setOrderSelected }) {
  
  const [materialData, setMaterialData] = useState({
    materialName: "",
    materialReference: "",
    materialBrand: "",
    materialClassification: "",
    materialStatusType: "Nuevo",
    quantity: 1,
    materialClientReference: "",
  });

    const {
      data: classificationsData,
      isLoading: classificationsIsLoading,
      error: classificationsError,
      fetchGet: classificationsFetchGet,
    } = useGet();
  
      const {
      data: brandsData,
      isLoading: brandsIsLoading,
      error: brandsError,
      fetchGet: brandsFetchGet,
    } = useGet();

    const { 
      putResponse: orderAddMaterialUpdatedData,
      isLoading: orderAddMaterialUpdateIsLoading,
      error: orderAddMaterialUpdateError,
      fetchPut: orderAddMaterialUpdateFetchPut,
      } = usePut();
  


  const { fetchPost } = usePost();

  useEffect(() => {
    if(isOpen){
      brandsFetchGet("/materials/getBrands");
      classificationsFetchGet("/materials/getClassifications");
    }
  }, [isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { quantity, materialClientReference, ...newMaterialData } = materialData;

    // Crear el nuevo material
    const response = await orderAddMaterialUpdateFetchPut(`/orders/updateAddMaterialToOrder/${orderSelected.id}`, newMaterialData);
    const createdMaterial = response?.material;

    if (!createdMaterial) return alert("Error al crear el material");

    // Agregarlo a la orden
    const newMaterialRow = {
      material: createdMaterial.id,
      quantity: parseInt(quantity),
      materialClientReference,
      delivered: false,
      deliveries: [],
      purchases: [],
      supplier: null,
    };

    setOrderSelected((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterialRow],
    }));

    onClose();
  };

  return !isOpen ? null : (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-bold">Crear y Añadir Material</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="materialName" value={materialData.materialName} onChange={handleChange} placeholder="Nombre del material" className="border px-3 py-2 rounded" />
          <input name="materialReference" value={materialData.materialReference} onChange={handleChange} placeholder="Referencia" className="border px-3 py-2 rounded" />

          <select name="materialBrand" value={materialData.materialBrand} onChange={handleChange} className="border px-3 py-2 rounded" size={3}>
            {brandsData?.brands?.map((b) => (
              <option key={b.id} value={b.id}>{b.brandName}</option>
            ))}
          </select>

          <select name="materialClassification" value={materialData.materialClassification} onChange={handleChange} className="border px-3 py-2 rounded" size={3} >
           
            {classificationsData?.classifications?.map((c) => (
              <option key={c.id} value={c.id}>{c.classificationName}</option>
            ))}
          </select>

          <select name="materialStatusType" value={materialData.materialStatusType} onChange={handleChange} className="border px-3 py-2 rounded">
            <option value="Nuevo">Nuevo</option>
            <option value="Reacondicionado">Reacondicionado</option>
          </select>

          <input name="quantity" value={materialData.quantity} onChange={handleChange} type="number" placeholder="Cantidad" className="border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="font-medium">Referencia Cliente</label>
          <input name="materialClientReference" value={materialData.materialClientReference} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1" />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
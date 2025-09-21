import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Dialog } from "@headlessui/react";
import useGet from "../../../../../hooks/useGet/useGet";
import usePost from "../../../../../hooks/usePost/usePost";
import usePut from "../../../../../hooks/usePut/usePut";

export default function AddOrderMaterialModal({ isOpen, onClose, orderSelected, setOrderSelected, orderAddMaterialUpdatedData, orderAddMaterialUpdateFetchPut }) {
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
    fetchGet: classificationsFetchGet,
  } = useGet();

  const {
    data: brandsData,
    fetchGet: brandsFetchGet,
  } = useGet();


  const { fetchPost } = usePost();

  useEffect(() => {
    if (isOpen) {
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
     await orderAddMaterialUpdateFetchPut(`/orders/updateAddMaterialToOrder/${orderSelected.id}`, materialData);
    onClose();
  };

  const brandOptions = brandsData?.brands?.map((b) => ({
    label: b.brandName,
    value: b.id,
  })) || [];

  const classificationOptions = classificationsData?.classifications?.map((c) => ({
    label: c.classificationName,
    value: c.id,
  })) || [];

  return !isOpen ? null : (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl space-y-2">
        <h2 className="text-xl font-bold">Crear y Añadir Material</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <input
            name="materialName"
            value={materialData.materialName}
            onChange={handleChange}
            placeholder="Nombre del material"
            className="border px-3 py-2 rounded"
          />
          <input
            name="materialReference"
            value={materialData.materialReference}
            onChange={handleChange}
            placeholder="Referencia"
            className="border px-3 py-2 rounded"
          />

          <div className="flex flex-col">
            <label className="mb-1">Marca</label>
            <Select
              className="text-sm"
              options={brandOptions}
              value={brandOptions.find(opt => opt.value === materialData.materialBrand) || null}
              onChange={(selected) =>
                setMaterialData((prev) => ({ ...prev, materialBrand: selected?.value || "" }))
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Clasificación</label>
            <Select
              className="text-sm"
              options={classificationOptions}
              value={classificationOptions.find(opt => opt.value === materialData.materialClassification) || null}
              onChange={(selected) =>
                setMaterialData((prev) => ({ ...prev, materialClassification: selected?.value || "" }))
              }
            />
          </div>

          <div className="flex flex-col">
            <label>Estado</label>
            <select
              name="materialStatusType"
              value={materialData.materialStatusType}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            >
              <option className="text-sm" value="Nuevo">Nuevo</option>
              <option className="text-sm" value="Reacondicionado">Reacondicionado</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Cantidad</label>
            <input
              name="quantity"
              value={materialData.quantity}
              onChange={handleChange}
              type="number"
              placeholder="Cantidad"
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="text-sm">
          <label>Referencia Cliente</label>
          <input
            name="materialClientReference"
            value={materialData.materialClientReference}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import BrandsModal from "./BrandsModal";
import ClassificationsModal from "./ClassificationsModal";

export default function MaterialsTable({ materials, setMaterials, brandsData, classificationsData }) {
  const [brandModalIndex, setBrandModalIndex] = useState(null);
  const [classificationModalIndex, setClassificationModalIndex] = useState(null);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        materialName: "",
        quantity: 1,
        materialBrand: "",
        materialReference: "",
        materialClassification: "",
        materialStatusType: "Nuevo",
        materialClientReference: "x",
      },
    ]);
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
  };

  const deleteMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  return (
    <div className="mt-5 relative">
      <div className="w-full pb-20 overflow-auto relative">
        <table className="w-full mt-2 border border-gray-300 z-50">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2 border border-gray-300 w-10"></th>
              <th className="p-2 border border-gray-300">Nombre del Material</th>
              <th className="p-2 border border-gray-300">Referencia</th>
              <th className="p-2 border border-gray-300">Cant</th>
              <th className="p-2 border border-gray-300">Marca</th>
              <th className="p-2 border border-gray-300">Clasificación</th>
              <th className="p-2 border border-gray-300">Estado</th>
              <th className="p-2 border border-gray-300">Referencia Cliente</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => {
              const brandName =
                brandsData?.brands?.find((b) => b.id === material.materialBrand)?.brandName ||
                "Seleccionar Marca";

              const classificationName =
                classificationsData?.classifications?.find((c) => c.id === material.materialClassification)
                  ?.classificationName || "Seleccionar Clasificación";

              return (
                <tr key={index} className="border border-gray-300 relative text-sm">
                  <td className="p-2 border border-gray-300 text-center">
                    <button onClick={() => deleteMaterial(index)}>
                      <XCircleIcon className="h-6 w-6 text-red-600 hover:text-red-800 cursor-pointer" />
                    </button>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 rounded"
                      value={material.materialName}
                      onChange={(e) => updateMaterial(index, "materialName", e.target.value)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 rounded"
                      value={material.materialReference}
                      onChange={(e) => updateMaterial(index, "materialReference", e.target.value)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      className="w-12 border border-gray-300 p-1 rounded"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                    />
                  </td>

                  <td
                    className="p-2 border border-gray-300 cursor-pointer text-blue-600 underline"
                    onClick={() => setBrandModalIndex(index)}
                  >
                    {brandName}
                  </td>

                  <td
                    className="p-2 border border-gray-300 cursor-pointer text-blue-600 underline"
                    onClick={() => setClassificationModalIndex(index)}
                  >
                    {classificationName}
                  </td>

                  <td className="p-2 border border-gray-300">
                    <select
                      className="w-full border border-gray-300 p-1 rounded text-sm"
                      value={material.materialStatusType}
                      onChange={(e) => updateMaterial(index, "materialStatusType", e.target.value)}
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Reacondicionado">Reacondicionado</option>
                    </select>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      className="w-20 border border-gray-300 p-1 rounded"
                      value={material.materialClientReference}
                      onChange={(e) => updateMaterial(index, "materialClientReference", e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        onClick={addMaterial}
      >
        + Agregar Material
      </button>

      {/* Modals */}
      <BrandsModal
        isOpen={brandModalIndex !== null}
        onClose={() => setBrandModalIndex(null)}
        brandsData={brandsData}
        onSelect={(value) => {
          updateMaterial(brandModalIndex, "materialBrand", value);
          setBrandModalIndex(null);
        }}
      />

      <ClassificationsModal
        isOpen={classificationModalIndex !== null}
        onClose={() => setClassificationModalIndex(null)}
        classificationsData={classificationsData}
        onSelect={(value) => {
          updateMaterial(classificationModalIndex, "materialClassification", value);
          setClassificationModalIndex(null);
        }}
      />
    </div>
  );
}

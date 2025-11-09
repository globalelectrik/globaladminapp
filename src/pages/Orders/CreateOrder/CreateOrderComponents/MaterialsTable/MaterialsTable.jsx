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
        salePrice: "",
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
        <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 text-left text-sm">
                <th className="p-3 font-semibold text-gray-700 w-12"></th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 min-w-[280px]">Nombre del Material</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 min-w-[180px]">Referencia</th>
                <th className="p-2 font-semibold text-gray-700 border-l border-gray-200 w-10">Cant</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 w-32">Precio Unitario</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 w-40">Marca</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 w-48">Clasificación</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 w-36">Estado</th>
                <th className="p-3 font-semibold text-gray-700 border-l border-gray-200 min-w-[150px]">Referencia Cliente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {materials.map((material, index) => {
              const brandName =
                brandsData?.brands?.find((b) => b.id === material.materialBrand)?.brandName ||
                "Seleccionar Marca";

              const classificationName =
                classificationsData?.classifications?.find((c) => c.id === material.materialClassification)
                  ?.classificationName || "Seleccionar Clasificación";

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150 text-xs">
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => deleteMaterial(index)}
                      className="p-1 rounded-full hover:bg-red-50 transition-colors duration-150"
                    >
                      <XCircleIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                  <td className="p-3 border-l border-gray-200">
                    <input
                      type="text"
                      className="w-full min-w-[260px] border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-xs"
                      value={material.materialName}
                      onChange={(e) => updateMaterial(index, "materialName", e.target.value)}
                      placeholder="Nombre del material"
                    />
                  </td>
                  <td className="p-3 border-l border-gray-200">
                    <input
                      type="text"
                      className="w-full min-w-[160px] border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-xs"
                      value={material.materialReference}
                      onChange={(e) => updateMaterial(index, "materialReference", e.target.value)}
                      placeholder="Referencia"
                    />
                  </td>
                  <td className="p-3 border-l border-gray-200">
                    <input
                      type="number"
                      className="w-10 border border-gray-300 px-1 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-center text-xs"
                      value={material.quantity.toFixed(0)}
                      onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                      min="1"
                    />
                  </td>

                  <td className="p-3 border-l border-gray-200">
                    <input
                      type="number"
                      className="w-28 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-xs"
                      value={material?.salePrice || ""}
                      onChange={(e) => updateMaterial(index, "salePrice", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </td>

                  <td 
                    className="p-3 border-l border-gray-200 cursor-pointer"
                    onClick={() => setBrandModalIndex(index)}
                  >
                    <div className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-150 text-xs font-medium">
                      {brandName}
                    </div>
                  </td>

                  <td 
                    className="p-3 border-l border-gray-200 cursor-pointer"
                    onClick={() => setClassificationModalIndex(index)}
                  >
                    <div className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-150 text-xs font-medium">
                      {classificationName}
                    </div>
                  </td>

                  <td className="p-3 border-l border-gray-200">
                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-xs bg-white"
                      value={material.materialStatusType}
                      onChange={(e) => updateMaterial(index, "materialStatusType", e.target.value)}
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Reacondicionado">Reacondicionado</option>
                    </select>
                  </td>
                  <td className="p-3 border-l border-gray-200">
                    <input
                      type="text"
                      className="w-full min-w-[130px] border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-xs"
                      value={material.materialClientReference}
                      onChange={(e) => updateMaterial(index, "materialClientReference", e.target.value)}
                      placeholder="Ref."
                    />
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 mt-4"
        onClick={addMaterial}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Agregar Material
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

import { useState, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import ClassificationsComboBox from './../../CreateMaterials/ClassificationsComboBox/ClassificationsComboBox';
import BrandsComboBox from "../../CreateMaterials/BrandsComboBox/BrandsComboBox";

export default function MaterialsTable({ materials, setMaterials, brandsData, classificationsData }) {
  const [dropdownData, setDropdownData] = useState(null); // Not used now but kept if needed
  const dropdownRef = useRef(null);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        materialName: "",
        quantity: 1,
        materialBrand: "",
        materialReference: "",
        materialClassification: "",
        materialStatus: "Nuevo",
        materialClientReference: "x",
        materialSerialNumber: "N/A"
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
              <th className="p-2 border border-gray-300">Num de Serie</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
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

                {/* Marca (Brand) ComboBox */}
                <td className="relative p-2 border border-gray-300 w-60">
                  <BrandsComboBox
                    brandsData={brandsData}
                    brandSelected={material.materialBrand}
                    setBrandSelected={(value) => updateMaterial(index, "materialBrand", value)}
                  />
                </td>

                {/* Clasificación ComboBox */}
                <td className="relative p-2 border border-gray-300 w-60">
                  <ClassificationsComboBox
                    classificationsData={classificationsData}
                    classificationSelected={material.materialClassification}
                    setClassificationSelected={(value) => updateMaterial(index, "materialClassification", value)}
                  />
                </td>

                <td className="p-2 border border-gray-300">
                  <select
                    className="w-full border border-gray-300 p-1 rounded text-sm"
                    value={material.materialStatus}
                    onChange={(e) => updateMaterial(index, "materialStatus", e.target.value)}
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
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    className="w-20 border border-gray-300 p-1 rounded"
                    value={material.materialSerialNumber}
                    onChange={(e) => updateMaterial(index, "materialSerialNumber", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        onClick={addMaterial}
      >
        + Agregar Material
      </button>
    </div>
  );
}

import { useState, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

export default function MaterialsTable({ materials, setMaterials, brandsData, classificationsData }) {
  const [dropdownData, setDropdownData] = useState(null); // Stores dropdown info
  const dropdownRef = useRef(null);

  // Function to add a new material row
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
        materialClientReference: "x"
      },
    ]);
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
    setDropdownData(null); // Close dropdown after selection
  };

  const deleteMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  // Function to open dropdown at the right position
  const openDropdown = (index, type, event) => {
    const rect = event.target.getBoundingClientRect();
    setDropdownData({
      index,
      type,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      }
    });
  };

  return (
    <div className="mt-6 relative"> {/* ✅ Table Wrapper */}
      <h2 className="text-lg font-semibold text-indigo-600">Materiales a Entregar</h2>

      <div className="overflow-x-auto">
        <table className="w-full mt-2 border border-gray-300 min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border border-gray-300 w-10"></th>
              <th className="p-2 border border-gray-300">Nombre del Material</th>
              <th className="p-2 border border-gray-300">Referencia</th>
              <th className="p-2 border border-gray-300">Cantidad</th>
              <th className="p-2 border border-gray-300">Marca</th>
              <th className="p-2 border border-gray-300">Clasificación</th>
              <th className="p-2 border border-gray-300">Estado</th>
              <th className="p-2 border border-gray-300">Referencia Cliente</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr key={index} className="border border-gray-300 relative">
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
                    className="w-16 border border-gray-300 p-1 rounded"
                    value={material.quantity}
                    onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                  />
                </td>

                {/* Marca (Brand) Dropdown */}
                <td className="p-2 border border-gray-300 relative">
                  <div
                    className="w-full border border-gray-300 p-1 rounded bg-white cursor-pointer"
                    onClick={(e) => openDropdown(index, "brand", e)}
                  >
                    {material.materialBrand || "Seleccione una marca"}
                  </div>
                </td>

                {/* Clasificación Dropdown */}
                <td className="p-2 border border-gray-300 relative">
                  <div
                    className="w-full border border-gray-300 p-1 rounded bg-white cursor-pointer"
                    onClick={(e) => openDropdown(index, "classification", e)}
                  >
                    {material.materialClassification || "Seleccione una clasificación"}
                  </div>
                </td>

                <td className="p-2 border border-gray-300">
                  <select
                    className="w-full border border-gray-300 p-1 rounded"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={addMaterial}
      >
        + Agregar Material
      </button>

      {/* 🔥 Render Dropdown Outside the Table */}
      {dropdownData &&
        createPortal(
          <ul
            ref={dropdownRef}
            className="absolute z-50 bg-white border border-gray-300 shadow-md max-h-40 overflow-y-auto rounded w-48"
            style={{
              top: dropdownData.position.top,
              left: dropdownData.position.left,
              width: dropdownData.position.width,
            }}
          >
            {dropdownData.type === "brand"
              ? brandsData?.brands?.map((brand) => (
                  <li
                    key={brand.id}
                    className="p-2 hover:bg-indigo-600 hover:text-white cursor-pointer"
                    onClick={() => updateMaterial(dropdownData.index, "materialBrand", brand.brandName)}
                  >
                    {brand.brandName}
                  </li>
                ))
              : classificationsData?.classifications?.map((classification) => (
                  <li
                    key={classification.id}
                    className="p-2 hover:bg-indigo-600 hover:text-white cursor-pointer"
                    onClick={() => updateMaterial(dropdownData.index, "materialClassification", classification.classificationName)}
                  >
                    {classification.classificationName}
                  </li>
                ))}
          </ul>,
          document.body
        )}
    </div>
  );
}

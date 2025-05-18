import { useState } from "react";
import MaterialsComboBox from "./MaterialsComboBox";

export default function CreatePurchaseModal({ 
  isOpen, 
  onClose, 
  selectedMaterial, 
  onSave,
  materials, 
  materialSelected, 
  setMaterialSelected
}) {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierType: "",
    purchasingTotal: "",
    purchasingQuantity: "",
    purchaseLink: "",
    deliveredToWarehouse: false,
    purchasingComments: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = () => {
    const purchase = {
      material: selectedMaterial?.material?._id || selectedMaterial?.material,
      supplierName: formData.supplierName,
      supplierType: formData.supplierType,
      purchasingTotal: parseFloat(formData.purchasingTotal),
      purchasingQuantity: parseInt(formData.purchasingQuantity),
      purchaseLink: formData.purchaseLink,
      deliveredToWarehouse: formData.deliveredToWarehouse,
      purchasingComments: formData.purchasingComments ? [{ comment: formData.purchasingComments }] : []
    };
    onSave(purchase);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] space-y-4 shadow-lg">
        <h2 className="text-lg font-bold">
          Nueva Compra {selectedMaterial?.material?.materialName ? `para ${selectedMaterial.material.materialName}` : ""}
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Material</label>
          <MaterialsComboBox
            materials={materials}
            materialSelected={materialSelected}
            setMaterialSelected={setMaterialSelected}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Nombre del proveedor</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tipo de proveedor</label>
          <select
            name="supplierType"
            value={formData.supplierType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona una opción</option>
            <option value="Ebay">Ebay</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Total de compra ($ MXN)</label>
          <input
            type="number"
            name="purchasingTotal"
            value={formData.purchasingTotal}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Cantidad adquirida</label>
          <input
            type="number"
            name="purchasingQuantity"
            value={formData.purchasingQuantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Enlace de compra</label>
          <input
            type="text"
            name="purchaseLink"
            value={formData.purchaseLink}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Comentarios</label>
          <textarea
            name="purchasingComments"
            value={formData.purchasingComments}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-x-2">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="deliveredToWarehouse"
              checked={formData.deliveredToWarehouse}
              onChange={handleChange}
            />
            <span>Entregado en almacén</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-indigo-600 text-white">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

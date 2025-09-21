import { useState } from "react";
import MaterialsComboBox from "../Materials/MaterialsComboBox";

export default function CreatePurchaseModal({ 
  orderSelected,
  isOpen, 
  onClose, 
  materials, 
  materialSelected, 
  setMaterialSelected,
  createPurchasePostResponse,
  createPurchaseFetchPost,
  orderId
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

  const [deliveryData, setDeliveryData] = useState({
    deliveryType: "",
    deliveryId: "",
    deliveryCompany: "",
    rececivedOk: false,
    purchasingDeliveryComments: "",
    purchasingDeliveryUpdates: ""
  });

  const [ materiaToPurchase, setMaterialToPurchase ] = useState("")
  const [validationErrors, setValidationErrors] = useState([]);
  const [purchasedQuantityWarn, setPurchasedQuantityWarn] = useState(false)

  const handleDeliveryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDeliveryData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const getPendingQuantity = (materialRow) => {
    const orderedQuantity = materialRow.quantity;
    const materialId = materialRow?.material?.id
  
    // Sum up the purchasing quantities in the order's purchases that match this material
    const purchasedQuantity = orderSelected.purchases
      ?.filter(p => p?.material?.id === materialId)
      ?.reduce((sum, p) => sum + (p?.purchasingQuantity || 0), 0) || 0;
    
    return orderedQuantity - purchasedQuantity;
  };

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    e.target.name == "purchasingQuantity" && e.target.value > getPendingQuantity(materialSelected) ? setPurchasedQuantityWarn(true) : setPurchasedQuantityWarn(false)
  };


const handleSubmit = async () => {
  const errors = [];

  // Validación de campos obligatorios
  if (!materialSelected?.material?.id && !materialSelected?.material) { errors.push("Selecciona un material")}
  if (!formData.purchasingQuantity || Number(formData.purchasingQuantity) <= 0) {errors.push("Cantidad comprada debe ser mayor a 0")}
  if (!formData.supplierName.trim()) {errors.push("Nombre del proveedor")}
  if (!formData.supplierType.trim()) {errors.push("Tipo de proveedor")}
  if (!formData.purchasingTotal || Number(formData.purchasingTotal) <= 0) {errors.push("Total de compra debe ser mayor a 0")}
  if (!formData.purchaseLink.trim()) {errors.push("Enlace de compra")}
  // Si hay errores, mostrarlos
  if (errors.length > 0) {
    setValidationErrors(errors);
    return;
  }

  // Si no hay errores, limpiar y enviar
  setValidationErrors([]);

  const purchase = {
    orderId: orderId,
    material: materialSelected?.material?.id || materialSelected?.material,
    purchasingQuantity: parseInt(formData.purchasingQuantity),
    supplierName: formData.supplierName,
    supplierType: formData.supplierType,
    purchasingTotal: parseFloat(formData.purchasingTotal),
    purchaseLink: formData.purchaseLink,
    purchasingComments: formData.purchasingComments ? [{ comment: formData.purchasingComments }] : [],
    deliveredToWarehouse: deliveryData.rececivedOk,
    purchasingDelivery: [{
      deliveryType: deliveryData.deliveryType,
      deliveryId: deliveryData.deliveryId,
      deliveryCompany: deliveryData.deliveryCompany,
      rececivedOk: deliveryData.rececivedOk,
      purchasingDeliveryComments: deliveryData.purchasingDeliveryComments ? [{ comment: deliveryData.purchasingDeliveryComments }] : [],
      purchasingDeliveryUpdates: deliveryData.purchasingDeliveryUpdates ? [{ comment: deliveryData.purchasingDeliveryUpdates }] : []
    }]
  };

  setPurchasedQuantityWarn(false)

  await createPurchaseFetchPost(`/orders/createOrderPurchase`, purchase);
  
  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-5xl space-y-3 shadow-lg overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg font-bold">
        Nueva Compra {materialSelected?.material?.materialName ? `para ${materialSelected.material.materialName}` : ""}
      </h2>
  
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section 1: Purchase Info */}
        <section className="w-full lg:w-1/2 space-y-3">
        <h3 className="font-semibold text-sm">Compra</h3>
          <div className="space-y-1">
            <label className="block text-sm font-small">Material</label>
            <MaterialsComboBox
              materials={materials}
              materialSelected={materialSelected}
              setMaterialSelected={setMaterialSelected}
            />
          </div>
  
          <div className="flex justify-between gap-4 space-y-1">
            <div>
              <label className="block text-sm font-small pt-1">Pendientes</label>
              <p className="text-center">{materialSelected ? getPendingQuantity(materialSelected) : ""}</p>
            </div>

            <div className="flex items-center">
              <label className="block text-sm font-small text-right pr-2">Cantidad comprada</label>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="purchasingQuantity"
                  value={formData.purchasingQuantity}
                  onChange={handleChange}
                  className="w-20 border rounded px-3 py-1"
                />
                {purchasedQuantityWarn && (<p className="text-red-600 text-xs"> Más de lo que<br/>se solicita</p>)}
              </div>
            </div>  
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-small">Nombre del proveedor</label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
  
          <div className="space-y-1">
            <label className="block text-sm font-small">Tipo de proveedor</label>
            <select
              name="supplierType"
              value={formData.supplierType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            >
              <option value="">Selecciona una opción</option>
              <option value="Ebay">Ebay</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
  
          <div className="space-y-1">
            <label className="block text-sm font-small">Total de compra ($ MXN)</label>
            <input
              type="number"
              name="purchasingTotal"
              value={formData.purchasingTotal}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
  
  
          <div className="space-y-1">
            <label className="block text-sm font-small">Enlace de compra</label>
            <input
              type="text"
              name="purchaseLink"
              value={formData.purchaseLink}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
  
          <div className="space-y-2">
            <label className="block text-sm font-medium">Comentarios</label>
            <textarea
              name="purchasingComments"
              value={formData.purchasingComments}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
        </section>
  
        {/* Section 2: Delivery Info */}
        <section className="w-full lg:w-1/2 space-y-3 pt-2 lg:pt-0">
          <h3 className="font-semibold text-sm">Entrega </h3>
          <h3 className="font-semibold text-sm text-red-600">(si aún no hay información, dejarlo en blanco)</h3>
  
          <div>
            <label className="block text-sm">Tipo de entrega</label>
            <select
              name="deliveryType"
              value={deliveryData.deliveryType}
              onChange={handleDeliveryChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona una opción</option>
              <option value="Intermediario">Intermediario</option>
              <option value="Almacén final">Almacén final</option>
              <option value="Otro (agregar comentario)">Otro (agregar comentario)</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm">ID de envío</label>
            <input
              type="text"
              name="deliveryId"
              value={deliveryData.deliveryId}
              onChange={handleDeliveryChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
  
          <div>
            <label className="block text-sm">Empresa de envío</label>
            <select
              name="deliveryCompany"
              value={deliveryData.deliveryCompany}
              onChange={handleDeliveryChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona una opción</option>
              <option value="DHL">DHL</option>
              <option value="UPS">UPS</option>
              <option value="USPS">USPS</option>
              <option value="FedEx">FedEx</option>
              <option value="Other">Otro</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm">Comentario</label>
            <input
              type="text"
              name="purchasingDeliveryComments"
              value={deliveryData.purchasingDeliveryComments}
              onChange={handleDeliveryChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
  
          <div>
            <label className="block text-sm">Actualización</label>
            <input
              type="text"
              name="purchasingDeliveryUpdates"
              value={deliveryData.purchasingDeliveryUpdates}
              onChange={handleDeliveryChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          

            { deliveryData?.deliveryType === "Almacén final" ? (
              <div>
                  <label className="block text-sm">Recibido en Almacén OK</label>
                  <input
                    type="checkbox"
                    name="rececivedOk"
                    checked={deliveryData.rececivedOk}
                    onChange={handleDeliveryChange}
                    className="ml-2"
                  />
              </div>
            ): (<></>) }
            
  
        </section>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
        <p>Por favor, rellena estos campos:</p>
          <ul className="text-sm list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
        
      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={() => { setPurchasedQuantityWarn(false); onClose(); }} className="px-4 py-2 rounded bg-gray-200 text-sm">
          Cancelar
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm">
          Guardar Compra
        </button>
      </div>
    </div>
  </div>
  );
}

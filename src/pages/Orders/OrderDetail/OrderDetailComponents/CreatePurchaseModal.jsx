import { useState } from "react";
import MaterialsComboBox from "./MaterialsComboBox";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

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
      ?.map(p => p.purchase) // extract populated purchase objects
      ?.filter(p => p?.material?.id === materialId)
      ?.reduce((sum, p) => sum + (p?.purchasingQuantity || 0), 0) || 0;
  
    return orderedQuantity - purchasedQuantity;
  };


  const handleSubmit = async () => {

    const purchase = {
      orderId:orderId,
      material: materialSelected?.material?.id || materialSelected?.material,
      purchasingQuantity: parseInt(formData.purchasingQuantity),
      supplierName: formData.supplierName,
      supplierType: formData.supplierType,
      purchasingTotal: parseFloat(formData.purchasingTotal),
      purchaseLink: formData.purchaseLink,
      purchasingComments: formData.purchasingComments ? [{ comment: formData.purchasingComments }] : [],
      deliveredToWarehouse:  deliveryData.rececivedOk,
      purchasingDelivery: [{
        deliveryType: deliveryData.deliveryType,
        deliveryId: deliveryData.deliveryId,
        deliveryCompany: deliveryData.deliveryCompany,
        rececivedOk: deliveryData.rececivedOk,
        purchasingDeliveryComments: deliveryData.purchasingDeliveryComments ? [{ comment: deliveryData.purchasingDeliveryComments }] : [],
        purchasingDeliveryUpdates: deliveryData.purchasingDeliveryUpdates ? [{ comment: deliveryData.purchasingDeliveryUpdates }] : []
      }]
    };


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
              <p className="text-center">{getPendingQuantity(materialSelected)}</p>
            </div>

            <div className="flex items-center">
              <label className="block text-sm font-small text-right pr-2">Cantidad comprada</label>
              <input
                type="number"
                name="purchasingQuantity"
                value={formData.purchasingQuantity}
                onChange={handleChange}
                className="w-20 border rounded px-3 py-1"
              />
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
          <h3 className="font-semibold text-sm">Entrega</h3>
  
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
  
      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-sm">
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

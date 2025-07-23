

export default function AddDeliveryAddressModal ({
    newAddress, 
    closeDeliveryAddressModal,
    handleNewAddressChange,
    addDeliveryAddress}) {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96 shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Agregar Dirección de Entrega</h3>
            <input
              type="text"
              placeholder="Alias de Dirección"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.aliasDeliveryAddress}
              onChange={(e) => handleNewAddressChange("aliasDeliveryAddress", e.target.value)}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.deliveryContactPhone}
              onChange={(e) => handleNewAddressChange("deliveryContactPhone", e.target.value)}
            />
            <input
              type="text"
              placeholder="Dirección Completa"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.deliveryAddress}
              onChange={(e) => handleNewAddressChange("deliveryAddress", e.target.value)}
            />
            <input
              type="text"
              placeholder="Municipio/Delegación"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.deliveryCity}
              onChange={(e) => handleNewAddressChange("deliveryCity", e.target.value)}
            />
            <input
              type="text"
              placeholder="Estado"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.deliveryState}
              onChange={(e) => handleNewAddressChange("deliveryState", e.target.value)}
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="w-full border rounded px-3 py-2"
              value={newAddress?.deliveryZipCode}
              onChange={(e) => handleNewAddressChange("deliveryZipCode", e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeDeliveryAddressModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600"
                onClick={addDeliveryAddress}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
  )
};


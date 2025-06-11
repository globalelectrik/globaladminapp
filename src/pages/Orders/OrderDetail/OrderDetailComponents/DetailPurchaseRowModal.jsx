import React from 'react';
import { formatCurrency } from '../../../../helpers/formatCurrency';
import { Link } from 'react-router-dom';

export default function DetailPurchaseRowModal({
  isOpen,
  onClose,
  selectedPurchaseRow
}) {
  if (!isOpen || !selectedPurchaseRow) return null;

  const purchase = selectedPurchaseRow;


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-6 pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Detalle de Compra</h2>

        {/* Compra en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div><strong>Material:</strong> {purchase?.material?.materialName ?? 'N/A'}</div>
          <div><strong>Referencia:</strong> {purchase?.material?.materialReference ?? 'N/A'}</div>
          <div><strong>Marca:</strong> {purchase?.material?.materialBrand?.brandName ?? 'N/A'}</div>
          <div><strong>Cantidad:</strong> {purchase?.purchasingQuantity}</div>
          <div><strong>Precio:</strong> {formatCurrency(purchase?.purchasingTotal)} {purchase?.currency}</div>
          <div><strong>Tipo de Proveedor:</strong> {purchase?.supplierType}</div>
          <div><strong>Entregado a almacén:</strong> {purchase?.deliveredToWarehouse ? 'Sí' : 'No'}</div>
        </div>

        {/* Envíos */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-1">Detalles de Envío</h3>

            {purchase?.purchasingDelivery?.map((delivery, idx) => (
              <div key={idx} className="border p-4 rounded-lg shadow-sm bg-white space-y-3">
                <h4 className="text-md font-bold text-gray-700">Entrega #{idx + 1}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div><strong>Tipo de entrega:</strong> {delivery?.deliveryType}</div>
                  <div><strong>Empresa:</strong> {delivery?.deliveryCompany}</div>
                  <div><strong>ID de entrega:</strong> {delivery?.deliveryId ?? 'N/A'}</div>
                  <div><strong>Recibido correctamente:</strong> {delivery?.rececivedOk ? 'Sí' : 'No'}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h5 className="font-semibold mb-2">Comentarios</h5>
                    <ul className="list-disc ml-5 space-y-1">
                      {delivery?.purchasingDeliveryComments?.length > 0 ? (
                        delivery?.purchasingDeliveryComments.map((c, i) => (
                          <li className='text-sm' key={i}>{c.comment}</li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm">Sin comentarios</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h5 className="font-semibold mb-2">Actualizaciones</h5>
                    <ul className="list-disc ml-5 space-y-1">
                      {delivery?.purchasingDeliveryUpdates?.length > 0 ? (
                        delivery?.purchasingDeliveryUpdates?.map((u, i) => (
                          <li className='text-sm' key={i}>{u.comment}</li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-sm">Sin actualizaciones</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

        <div className="flex justify-between pt-2">
          <button
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            Cerrar
          </button>

           <Link className='text-indigo-600' to={`/purchases/purchaseDetail/${purchase?.id}`}>Ver Detalles</Link> 
        </div>
      </div>
    </div>
  );
}

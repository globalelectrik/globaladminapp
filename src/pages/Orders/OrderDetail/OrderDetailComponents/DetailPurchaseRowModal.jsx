import React from 'react';
import { formatCurrency } from '../../../../helpers/formatCurrency';
import { Link } from 'react-router-dom';

export default function DetailPurchaseRowModal({
  isOpen,
  onClose,
  selectedPurchaseRow,
}) {
  if (!isOpen || !selectedPurchaseRow) return null;

  const purchase = selectedPurchaseRow;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-6 pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Detalle de Compra</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
         <div className="space-y-1">
            {[
              { label: 'Referencia:', value: purchase?.material?.materialReference ?? 'N/A' },
              { label: 'Marca:', value: purchase?.material?.materialBrand?.brandName ?? 'N/A' },
              { label: 'Cantidad:', value: purchase?.purchasingQuantity },
              { label: 'Coste Total:', value: `${formatCurrency(purchase?.purchasingTotal)}` },
              { label: 'Tipo de Proveedor:', value: purchase?.supplierType },
              { label: 'Entregado a almacén:', value: purchase?.deliveredToWarehouse ? 'Sí' : 'No' },
              {
                label: 'Enlace a compra:',
                value: (
                  <a
                    className="text-indigo-600 underline"
                    href={purchase?.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {purchase?.purchaseLink}
                  </a>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2 items-center px-2 py-1 rounded ${idx % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}`}
              >
                <div className="w-32 font-medium text-gray-600">{item.label}</div>
                <div className="flex-1">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {purchase?.purchasingDelivery?.map((delivery, idx) => (
              <div
                key={idx}
                className="border p-3 rounded-lg shadow-sm bg-white space-y-1"
              >
                <h4 className="text-md font-bold text-gray-700">Entrega #{idx + 1}</h4>

                <div className="grid grid-cols-[auto,1fr] gap-x-2 text-sm">
                  <div className="font-medium text-gray-600 py-1">Tipo de entrega:</div>
                  <div className="bg-gray-50 rounded px-2 py-1">{delivery?.deliveryType}</div>

                  <div className="font-medium text-gray-600 py-1">Empresa:</div>
                  <div className="bg-gray-50 rounded px-2 py-1">{delivery?.deliveryCompany}</div>

                  <div className="font-medium text-gray-600 py-1">ID de entrega:</div>
                  <div className="bg-gray-50 rounded px-2 py-1">{delivery?.deliveryId ?? 'N/A'}</div>

                  <div className="font-medium text-gray-600 py-1">Recibido correctamente:</div>
                  <div className="bg-gray-50 rounded px-2 py-1">{delivery?.rececivedOk ? 'Sí' : 'No'}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h5 className="font-semibold mb-2">Comentarios</h5>
                    <ul className="list-disc ml-5 space-y-1">
                      {delivery?.purchasingDeliveryComments?.length > 0 ? (
                        delivery.purchasingDeliveryComments.map((c, i) => (
                          <li className="text-sm" key={i}>{c.comment}</li>
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
                        delivery.purchasingDeliveryUpdates.map((u, i) => (
                          <li className="text-sm" key={i}>{u.comment}</li>
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
        </div>

        <div className="flex justify-between pt-2">
          <button
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            Cerrar
          </button>

          <Link
            className="text-indigo-600"
            to={`/purchases/purchaseDetail/${purchase?.id}`}
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}

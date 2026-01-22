import React from 'react';
import { formatCurrency } from '../../../../../utils/helpers/formatCurrency';
import { Link } from 'react-router-dom';

export default function DetailPurchaseRowModal({
  isOpen,
  onClose,
  selectedPurchaseRow,
}) {
  if (!isOpen || !selectedPurchaseRow) return null;

  const purchase = selectedPurchaseRow;

  console.log("purchase--> ", purchase);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-6 pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">Detalle de Compra</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-2">
         <div className="space-y-1">
            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-100">
              <div className="w-32 font-medium text-gray-600">Referencia:</div>
              <div className="flex-1">{purchase?.material?.materialReference ?? 'N/A'}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-50">
              <div className="w-32 font-medium text-gray-600">Marca:</div>
              <div className="flex-1">{purchase?.material?.materialBrand?.brandName ?? 'N/A'}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-100">
              <div className="w-32 font-medium text-gray-600">Cantidad:</div>
              <div className="flex-1">{purchase?.purchasingQuantity}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-50">
              <div className="w-32 font-medium text-gray-600">Coste Total:</div>
              <div className="flex-1">{formatCurrency(purchase?.purchasingTotal)}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-100">
              <div className="w-32 font-medium text-gray-600">Tipo de Proveedor:</div>
              <div className="flex-1">{purchase?.supplierType}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-50">
              <div className="w-32 font-medium text-gray-600">Entregado a almacén:</div>
              <div className="flex-1">{purchase?.deliveredToWarehouse ? 'Sí' : 'No'}</div>
            </div>

            <div className="flex gap-2 items-center px-2 py-1 rounded bg-gray-100">
              <div className="w-32 font-medium text-gray-600">Enlace a compra:</div>
              <div className="flex-1 overflow-hidden">
                <a
                  className="text-indigo-600 underline hover:text-indigo-800 break-all"
                  href={purchase?.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {purchase?.purchaseLink}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-1">
          <h2 className="text-lg font-semibold">Entregas a almacén</h2>
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

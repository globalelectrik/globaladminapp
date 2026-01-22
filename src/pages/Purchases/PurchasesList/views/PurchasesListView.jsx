import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet';
import { addWorkingDays } from '../../../../utils/helpers/addWorkingDaysToDate';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency';
import React from "react";


export default function PurchasesListView() {
    const [expandedRows, setExpandedRows] = useState({});

  const {
    data: purchasesData,
    isLoading: purchasesIsLoading,
    error: purchasesError,
    fetchGet: purchasesFetchGet,
  } = useGet();

  const getOrdersButtonHandler = async () => {
    purchasesFetchGet("/getPurchases");
  };

   const toggleRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };


  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-2">
          <NavLink
            to={'/orders/newOrder'}
            className='flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition'
          >
            <PlusCircleIcon className='h-5 w-5 text-white' aria-hidden='true' />
            Nueva Compra
          </NavLink>

          <button
            onClick={getOrdersButtonHandler}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-700 transition"
          >
            Cargar Compras
          </button>
        </div>

        <div>
         
        </div>
      </div>

      {purchasesData?.orders?.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm text-sm">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-10"></th>
                <th className="p-2 text-left">Número de pedido</th>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchasesData?.orders?.map((order) => (
                <React.Fragment key={order.id}>
                  {/* Fila principal del pedido */}
                  <tr className="border-t border-gray-200">
                    <td className="text-center">
                      <button onClick={() => toggleRow(order.id)}>
                        {expandedRows[order.id] ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className="p-2">{order.orderNumGlobal}</td>
                    <td className="p-2">{order.client.commercialClientName}</td>
                    <td className="p-2">{formatCurrency(order.orderTotal)}</td>
                  </tr>

                  {/* Fila expandida con materiales */}
                  {expandedRows[order.id] && (
                    <tr>
                      <td></td>
                      <td colSpan="3" className="p-2 bg-gray-50">
                        <table className="w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="pt-1 text-left w-60">Nombre</th>
                              <th className="pt-1 text-center">Referencia</th>
                              <th className="pt-1 text-center">Cantidad</th>
                              <th className="pt-1 text-center">Coste</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order?.purchases?.map((purchase, idx) => (
                              <tr key={idx} className="border-t border-gray-200">
                                <td className="p-2">{purchase.material.materialName}</td>
                                <td className="p-2 text-center">{purchase.material.materialReference}</td>
                                <td className="p-2 text-center">{purchase.purchasingQuantity}</td>
                                <td className="p-2 text-center">{formatCurrency(purchase.purchasingTotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

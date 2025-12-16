import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet';
import { addWorkingDays } from '../../../../utils/helpers/addWorkingDaysToDate';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency';
import { generateMonthOptions, getCurrentYYMM } from '../../CreateOrder/helpers/getMonthYear';


export default function OrdersListView() {
  const [highlightDeliveryStatus, setHighlightDeliveryStatus] = useState(false);
  const [monthFiltered, setMonthFiltered] = useState(getCurrentYYMM());

  const {
    data: ordersFilteredData,
    isLoading: ordersFilteredIsLoading,
    error: ordersFilteredError,
    fetchGet: ordersFilteredFetchGet,
  } = useGet();

  console.log(ordersFilteredData);

  useEffect(() => {
    ordersFilteredFetchGet(`/orders/${monthFiltered}`);
  }, [monthFiltered]);

  const monthOptions = generateMonthOptions();
  const now = new Date();

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-2">
          <NavLink
            to={'/orders/newOrder'}
            className='flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition'
          >
            <PlusCircleIcon className='h-5 w-5 text-white' aria-hidden='true' />
            Nuevo Pedido
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {/* Month/Year Filter */}
          <div className="flex items-center gap-2">
            
            <select
              id="monthFilter"
              value={monthFiltered}
              onChange={(e) => setMonthFiltered(e.target.value)}
              className="pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Toggle Button */}
          <button
            onClick={() => setHighlightDeliveryStatus(!highlightDeliveryStatus)}
            className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 transition"
          >
            {highlightDeliveryStatus ? "Ocultar Colores" : "Mostrar Colores"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {ordersFilteredIsLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando pedidos...</p>
        </div>
      )}

      {/* Error State */}
      {ordersFilteredError && (
        <div className="text-center py-8">
          <p className="text-red-500">Error al cargar los pedidos</p>
        </div>
      )}

      {/* Empty State */}
      {!ordersFilteredIsLoading && !ordersFilteredError && ordersFilteredData?.orders?.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay pedidos para el mes seleccionado</p>
        </div>
      )}

      {/* Orders Table */}
      {!ordersFilteredIsLoading && ordersFilteredData?.orders?.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-left border-collapse rounded-lg">
            <thead className="bg-indigo-600 text-white text-sm">
              <tr>
                <th className="px-4 py-3">#Ord GE</th>
                <th className="px-4 py-3">#Cotiz</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha Pedido</th>
                <th className="px-4 py-3">Entrega Promesa</th>
                <th className="px-4 py-3">Promesa de Pago</th>
                <th className="px-4 py-3">Total + IVA</th>
                <th className="px-4 py-3">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {ordersFilteredData?.orders?.map((order, idx) => {
                const promiseDate = order.datePOClient
                  ? addWorkingDays(new Date(order.datePOClient), order.deliverInDays || 0)
                  : null;

                return (
                  <tr key={idx} className={`border-b text-sm hover:bg-gray-50`}>
                    <td className="px-4 py-3">{order.orderNumGlobal}</td>
                    <td className="px-4 py-3">{order.quotNumGlobal}</td>
                    <td className="px-4 py-3">{order.user?.name || '—'}</td>
                    <td className="px-4 py-3">{order.vatName || '—'}</td>
                    <td className="px-4 py-3">
                      {order.datePOClient?.slice(0, 10) || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {promiseDate ? promiseDate.toISOString().slice(0, 10) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {order.clientPaymentPromiseDate?.slice(0, 10) || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(order.orderTotalPlusTax?.toFixed(2))}
                    </td>
                    <td className="px-4 py-3">
                      <Link className='text-indigo-600 hover:underline' to={`/orders/orderDetail/${order.id}`}>
                        Detalles
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

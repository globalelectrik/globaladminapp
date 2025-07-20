import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet';
import { addWorkingDays } from '../../../../utils/helpers/addWorkingDaysToDate';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency';

export default function OrdersListView() {
  const [highlightDeliveryStatus, setHighlightDeliveryStatus] = useState(false);

  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    error: ordersError,
    fetchGet: ordersFetchGet,
  } = useGet();

  const getOrdersButtonHandler = async () => {
    ordersFetchGet("/orders");
  };

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

          <button
            onClick={getOrdersButtonHandler}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-700 transition"
          >
            Cargar Pedidos
          </button>
        </div>

        <div>
          <button
            onClick={() => setHighlightDeliveryStatus(!highlightDeliveryStatus)}
            className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800 transition"
          >
            {highlightDeliveryStatus ? "Ocultar Colores" : "Mostrar Colores"}
          </button>
        </div>
      </div>

      {ordersData?.orders?.length > 0 && (
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
              {ordersData.orders.map((order, idx) => {
                const promiseDate = order.datePOClient
                  ? addWorkingDays(new Date(order.datePOClient), order.deliverInDays || 0)
                  : null;

                let rowColor = '';
                if (highlightDeliveryStatus) {
                  if (order.delivered) {
                    rowColor = 'bg-green-50';
                  } else if (promiseDate && new Date(promiseDate) < now) {
                    rowColor = 'bg-red-50';
                  } else {
                    rowColor = 'bg-yellow-50';
                  }
                }

                return (
                  <tr key={idx} className={`border-b text-sm ${rowColor} hover:bg-gray-50`}>
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

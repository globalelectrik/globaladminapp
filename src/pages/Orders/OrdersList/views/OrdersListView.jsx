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
    <div className="p-4">
      <div className="flex flex-wrap gap-4 justify-between items-end mb-4">
        <div>
          <NavLink
            to={'/orders/newOrder'}
            className='group flex gap-x-2 rounded-md bg-indigo-600 p-2 mb-3 text-sm font-semibold text-white hover:bg-indigo-100 hover:text-indigo-600 hover:ring-1 hover:ring-indigo-600'>
            <PlusCircleIcon
              className='h-5 w-5 text-white group-hover:text-indigo-600'
              aria-hidden='true'
            />
            Nuevo Pedido
          </NavLink>
         
          <button
            onClick={getOrdersButtonHandler}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-700"
          >
            Cargar Pedidos
          </button>
      </div>


        <div className='flex flex-col'>
          <button
            onClick={() => setHighlightDeliveryStatus(!highlightDeliveryStatus)}
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded text-sm text-yellow-800"
          >
            {highlightDeliveryStatus ? "Ocultar Colores" : "Mostrar Colores"}
          </button>
        </div>
      </div>

      {ordersData?.orders?.length > 0 && (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-left border-collapse rounded-lg">
            <thead className="bg-indigo-600 text-slate-50 border-b text-sm">
              <tr>
                <th className="px-4 py-2 rounded-tl-md">#Ord GE</th>
                <th className="px-4 py-2 ">#Cotiz</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Fecha Pedido</th>
                <th className="px-4 py-2">Entrega Promesa</th>
                <th className="px-4 py-2">Promesa de Pago</th>
                <th className="px-4 py-2">Total + IVA</th>
                <th className="px-4 py-2">Detalles</th>
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
                    rowColor = 'bg-green-100';
                  } else if (promiseDate && new Date(promiseDate) < now) {
                    rowColor = 'bg-red-100';
                  } else {
                    rowColor = 'bg-yellow-100';
                  }
                }

                return (
                  <tr key={idx} className={`border-b hover:bg-opacity-80 text-sm ${rowColor}`}>
                    <td className="px-4 py-2 border border-slate-400">{order.orderNumGlobal}</td>
                    <td className="px-4 py-2 border border-slate-400">{order.quotNumGlobal}</td>
                    <td className="px-4 py-2 border border-slate-400">{order.user?.name || '—'}</td>
                    <td className="px-4 py-2 border border-slate-400">{order.vatName || '—'}</td>
                    <td className="px-4 py-2 border border-slate-400">
                      {order.datePOClient?.slice(0, 10) || '—'}
                    </td>
                    <td className="px-4 py-2 border border-slate-400">
                      {promiseDate ? promiseDate.toISOString().slice(0, 10) : '—'}
                    </td>
                    <td className="px-4 py-2 border border-slate-400">
                      {order.clientPaymentPromiseDate?.slice(0, 10) || '—'}
                    </td>
                    <td className="px-4 py-2 border border-slate-400">{formatCurrency(order.orderTotalPlusTax?.toFixed(2))}</td>
                    <td className="px-4 py-2 border border-slate-400 rounded-tl-md">
                      <Link className='text-indigo-600' to={`/orders/orderDetail/${order.id}`}>Detalles</Link> 
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
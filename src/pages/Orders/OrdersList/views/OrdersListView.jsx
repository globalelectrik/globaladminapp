import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet';
import { addWorkingDays } from '../../../../utils/helpers/addWorkingDaysToDate';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency';
import { generateMonthOptions, getCurrentYYMM } from '../../CreateOrder/helpers/getMonthYear';
import SearchBar from '../components/SearchBar';
import { use } from 'react';


export default function OrdersListView() {
  const [highlightDeliveryStatus, setHighlightDeliveryStatus] = useState(false);
  const [monthFiltered, setMonthFiltered] = useState(getCurrentYYMM());
  const [ordersData, setOrdersData] = useState([]);
  const [monthlyTotalInvoicing, setMonthlyTotalInvoicing] = useState(0);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const {
    data: ordersFilteredData,
    isLoading: ordersFilteredIsLoading,
    error: ordersFilteredError,
    fetchGet: ordersFilteredFetchGet,
  } = useGet();

  const {
    data: searchData,
    isLoading: searchIsLoading,
    error: searchError,
    fetchGet: searchFetchGet,
  } = useGet()


  useEffect(() => {
    ordersFilteredFetchGet(`/orders/${monthFiltered}`);
  }, [monthFiltered]);

  useEffect(() => {
    if (ordersFilteredData?.orders) {
    setOrdersData(ordersFilteredData);
    setMonthlyTotalInvoicing(ordersFilteredData.orders.reduce((total, order) => total + (order.orderTotal || 0), 0));
    } 
  }, [ordersFilteredData]);

  useEffect(() => {
    if (searchData?.orders) {
      console.log("ENTRO--->>>", searchData.orders);
    setOrdersData(searchData);
    setMonthlyTotalInvoicing(searchData.orders.reduce((total, order) => total + (order.orderTotal || 0), 0));
    } 
  }, [searchData]);

  const monthOptions = generateMonthOptions();
  const now = new Date();


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-2">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md px-6 py-2 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and New Order Button */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
              <NavLink
                to={'/orders/newOrder'}
                className='inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-xl'
              >
                <PlusCircleIcon className='h-5 w-5 text-white' aria-hidden='true' />
                Nuevo Pedido
              </NavLink>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200 shadow-sm">
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Total Mensual</p>
              <p className="text-2xl font-bold text-indigo-900">{formatCurrency(monthlyTotalInvoicing)}</p>
              <p className="text-xs text-indigo-600 mt-1">Antes de IVA</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-shrink-0">
              <SearchBar
                searchIsLoading={searchIsLoading}
                searchError={searchError}
                searchData={searchData} 
                searchFetchGet={searchFetchGet}
                ordersData={ordersData}
                setOrdersData={setOrdersData}
              />
            </div>

            {/* Right Side Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Month Filter */}
              <div className="flex items-center">
                <select
                  id="monthFilter"
                  value={monthFiltered}
                  onChange={(e) => setMonthFiltered(e.target.value)}
                  className="pl-3 pr-10 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm hover:border-gray-400"
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Toggle */}
              <button
                onClick={() => setHighlightDeliveryStatus(!highlightDeliveryStatus)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                  highlightDeliveryStatus 
                    ? 'bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 text-yellow-900' 
                    : 'bg-white hover:bg-yellow-50 border-2 border-gray-300 text-gray-700 hover:border-yellow-300'
                }`}
              >
                {highlightDeliveryStatus ? "🎨 Colores Activos" : "🎨 Mostrar Colores"}
              </button>
            </div>
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
      {!ordersFilteredIsLoading && ordersData?.orders?.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-left border-collapse rounded-lg">
            <thead className="bg-indigo-600 text-white text-xs">
              <tr>
                <th className="px-4 py-3">#Ord GE</th>
                <th className="px-4 py-3">#OC Cliente</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha Pedido</th>
                <th className="px-4 py-3">Entrega Promesa</th>
                <th className="px-4 py-3">Entregas</th>
                <th className="px-4 py-3">Promesa de Pago</th>
                <th className="px-4 py-3">Total + IVA</th>
                <th className="px-4 py-3">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders?.map((order, idx) => {
                const promiseDate = order.datePOClient
                  ? addWorkingDays(new Date(order.datePOClient), order.deliverInDays || 0)
                  : null;

                const isExpired = promiseDate && promiseDate < now;
                const hasNoDeliveries = order.deliveries.length === 0;

                let rowBgColor = '';
                if (highlightDeliveryStatus) {
                  if (isExpired && hasNoDeliveries) {
                    rowBgColor = 'bg-red-200';
                  } else if (hasNoDeliveries) {
                    rowBgColor = 'bg-yellow-200';
                  } else if (order.deliveries.length > 0) {
                    rowBgColor = 'bg-green-200';
                  }
                }

                const isExpanded = expandedOrderId === order.id;

                return (
                  <React.Fragment key={order.id || idx}>
                    <tr 
                      className={`border-b text-xs cursor-pointer ${rowBgColor}`}
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <td className="px-4 py-3">{order.orderNumGlobal}</td>
                      <td className="px-4 py-3">{order.pOClientNumber}</td>
                      <td className="px-4 py-3">{order.user?.name || '—'}</td>
                      <td className="px-4 py-3">{order.vatName || '—'}</td>
                      <td className="px-4 py-3">
                        {order.datePOClient?.slice(0, 10) || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {promiseDate ? promiseDate.toISOString().slice(0, 10) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {order.deliveries.length}
                      </td>
                      <td className="px-4 py-3">
                        {order.clientPaymentPromiseDate?.slice(0, 10) || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(order.orderTotalPlusTax?.toFixed(2))}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Link className='text-indigo-600 hover:underline' to={`/orders/orderDetail/${order.id}`}>
                          Detalles
                        </Link>
                      </td>
                    </tr>
                    
                    {/* Expanded Row - Materials Details */}
                    {isExpanded && (
                      <tr className={`border-b ${rowBgColor}`}>
                        <td colSpan="10" className="px-4 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Materiales del Pedido</h4>
                            {order.materials && order.materials.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm border border-gray-300 rounded">
                                  <thead className="bg-gray-200">
                                    <tr>
                                      <th className="px-3 py-2 text-left border-b">Material</th>
                                      <th className="px-3 py-2 text-left border-b">Referencia</th>
                                      <th className="px-3 py-2 text-left border-b">Cantidad</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {order.materials.map((material, materialIdx) => (
                                      <tr key={materialIdx} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2">{material.material.materialName || '—'}</td>
                                        <td className="px-3 py-2">{material.material.materialReference || '—'}</td>
                                        <td className="px-3 py-2">{material.quantity || '—'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No hay materiales registrados para este pedido</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

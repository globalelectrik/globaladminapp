import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function OrdersListView() {

  return (
    <>
    <div>
      <NavLink
        onClick={() => setSidebarOpen(false)}
        to={'/orders/newOrder'}
        className={
          'group mb-4 flex gap-x-3 rounded-md bg-indigo-600 p-2 text-sm font-semibold leading-6 text-gray-50 hover:bg-indigo-100 hover:text-indigo-600 hover:ring-1 hover:ring-indigo-600'
        }>
        <PlusCircleIcon
          className={'h-6 w-6 shrink-0 text-gray-50 group-hover:text-indigo-600'}
          aria-hidden='true'
        />
        Nuevo Pedido
      </NavLink>
    </div>
    </>
  );
}


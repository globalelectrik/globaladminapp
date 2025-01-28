import React from 'react';
import useGet from '../../../../hooks/useGet/useGet';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ClientsListView() {
  const {
    data: clientsData,
    isLoading: clientsIsLoading,
    error: clientsError,
    fetchGet: clientsFetchGet,
  } = useGet();

  const getClientsHandler = async () => {
    clientsFetchGet('/clients');
  };

  console.log(clientsData);

  return (
    <>
      <div className="p-2 space-y-2">
        {/* Clients Section */}
        <div className="rounded border p-4 bg-white shadow-sm">
          <div className="flex justify-between my-3">
            <h2 className="text-sm font-semibold mb-2">CLIENTES</h2>
            <Link
              className="rounded text-xs bg-indigo-500 px-2 py-2 text-white hover:bg-indigo-600"
              to="/clients/createClient"
            >
              Nuevo Cliente
            </Link>
          </div>
          <div className="mb-2 flex gap-2">
            <button
              onClick={getClientsHandler}
              className="rounded text-xs bg-indigo-500 px-2 py-2 text-white hover:bg-indigo-600"
            >
              Ver Clientes
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Nombre Cliente</th>
                  <th className="py-2 px-4 border-b">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {clientsData?.clients.map((client) => (
                  <tr key={client.id}>
                    <td className="py-2 px-4 border-b">{client.id}</td>
                    <td className="py-2 px-4 border-b">
                      {client.commercialClientName}
                    </td>
                    <td className="py-2 px-4 border-b">
                     <Link className='text-indigo-600' to={`/clients/clientDetail/${client.id}`}>Detalles</Link> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

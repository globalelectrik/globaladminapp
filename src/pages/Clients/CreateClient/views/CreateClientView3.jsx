import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePost from '../../../../hooks/usePost/usePost';

export default function CreateClientView() {
  const [newClient, setNewClient] = useState({
    commercialClientName: '',
    companyName: [
      {
        vatName: '',
        vatNumber: '',
      },
    ],
  });

  const {
    postResponse: createClientPostResponse,
    isLoading: createClientIsLoading,
    error: createClientError,
    fetchPost: createClientFetchPost,
  } = usePost();

  const handleInputChange = (e, path) => {
    const keys = path.split('.');
    const updatedClient = { ...newClient };
    let ref = updatedClient;

    for (let i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]];
    }

    ref[keys[keys.length - 1]] = e.target.value;
    setNewClient(updatedClient);
  };

  const addCompany = () => {
    setNewClient((prev) => ({
      ...prev,
      companyName: [
        ...prev.companyName,
        {
          vatName: '',
          vatNumber: '',
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClientFetchPost('/clients/createClient', newClient);
  };

  return (
    <div className='space-y-4 p-2'>
      <div className='rounded border bg-white p-4 shadow-sm'>
        <div className='flex justify-between'>
          <h2 className='mb-2 text-sm font-semibold'>NUEVO CLIENTE</h2>
          <Link
            className='rounded bg-indigo-500 px-2 py-2 text-xs text-white hover:bg-indigo-600'
            to='/clients'>
            Ir a Clientes
          </Link>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Nombre Comercial (o Apodo)</label>
            <input
              type='text'
              value={newClient.commercialClientName}
              onChange={(e) => handleInputChange(e, 'commercialClientName')}
              className='w-full rounded border px-2 py-1'
            />
          </div>

          {newClient.companyName.map((company, companyIndex) => (
            <div key={companyIndex} className='rounded border p-4'>
              <h3 className='mb-2 text-sm font-semibold'>Empresa {companyIndex + 1}</h3>
              <div>
                <label className='block text-sm font-medium'>Razón Social</label>
                <input
                  type='text'
                  value={company.vatName}
                  onChange={(e) => handleInputChange(e, `companyName.${companyIndex}.vatName`)}
                  className='w-full rounded border px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Número Fiscal (RFC)</label>
                <input
                  type='text'
                  value={company.vatNumber}
                  onChange={(e) => handleInputChange(e, `companyName.${companyIndex}.vatNumber`)}
                  className='w-full rounded border px-2 py-1'
                />
              </div>
            </div>
          ))}
          <div className='flex flex-col gap-3'>
            <button
              type='button'
              onClick={addCompany}
              className='mt-2 text-left text-sm text-blue-500 hover:underline'>
              + Agregar Razón Social a Cliente
            </button>

            <button
              type='submit'
              className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
              Crear Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

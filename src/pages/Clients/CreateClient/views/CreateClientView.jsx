import React, { useState, useEffect } from 'react';
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

  const [formErrors, setFormErrors] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 🔴 Success Modal control
  const [urlToClient, setUrlToClient] = useState("")

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

  const deleteCompany = (index) => {
    setNewClient((prev) => ({
      ...prev,
      companyName: prev.companyName.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    if (!newClient.commercialClientName.trim()) {
      errors.push('Nombre Comercial');
    }

    newClient.companyName.forEach((company, index) => {
      if (!company.vatName.trim()) {
        errors.push(`Razón Social de la empresa ${index + 1}`);
      }
      if (!company.vatNumber.trim()) {
        errors.push(`RFC de la empresa ${index + 1}`);
      }
    });

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    await createClientFetchPost('/clients/createClient', newClient);
  };

  // -->>>  Si el mensaje de post es correcto, se abre el modal con el url para ir a agregar más datos y se limpian los datos del front

  useEffect(() => {
    if (createClientPostResponse?.message === 'success') {
      setShowSuccessModal(true);
      setUrlToClient(`/clients/clientDetail/${createClientPostResponse.client.id}`);      
      setNewClient({
        commercialClientName: '',
        companyName: [
          {
            vatName: '',
            vatNumber: '',
          },
        ],
      });
    }
  }, [createClientPostResponse]);


  return (
    <div className="p-2 space-y-4">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-lg font-semibold text-green-600">✅ Cliente creado correctamente</h2>
            <h3>
              <Link to={`${urlToClient}`} className="text-blue-600 hover:underline">
                Ir al cliente
              </Link>
            </h3>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="rounded border p-4 bg-white shadow-sm">
        <div className="flex justify-between">
          <h2 className="text-sm font-semibold mb-2">NUEVO CLIENTE</h2>
          <Link
            className="rounded text-xs bg-indigo-500 px-2 py-2 text-white hover:bg-indigo-600"
            to="/clients"
          >
            Ir a Clientes
          </Link>
        </div>

        {formErrors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold block mb-2">Faltan campos obligatorios:</strong>
            <ul className="list-disc ml-5 text-sm">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre Comercial (o Apodo)</label>
            <input
              type="text"
              value={newClient.commercialClientName}
              onChange={(e) => handleInputChange(e, 'commercialClientName')}
              className="w-full rounded border px-2 py-1"
            />
          </div>

          {newClient.companyName.map((company, companyIndex) => (
            <div key={companyIndex} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Empresa {companyIndex + 1}</h3>
                {newClient.companyName.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteCompany(companyIndex)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Razón Social</label>
                <input
                  type="text"
                  value={company.vatName}
                  onChange={(e) =>
                    handleInputChange(e, `companyName.${companyIndex}.vatName`)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Número Fiscal (RFC)</label>
                <input
                  type="text"
                  value={company.vatNumber}
                  onChange={(e) =>
                    handleInputChange(e, `companyName.${companyIndex}.vatNumber`)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={addCompany}
              className="text-sm text-blue-500 mt-2 hover:underline text-left"
            >
              + Agregar Razón Social a Cliente
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Crear Cliente
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

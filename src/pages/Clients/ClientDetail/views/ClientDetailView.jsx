import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import useGet from '../../../../hooks/useGet/useGet';
import usePut from '../../../../hooks/usePut/usePut';

export default function ClientDetailView() {
  const [clientToEdit, setClientToEdit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false); // Modal for new company
  const [newAddress, setNewAddress] = useState({});
  const [newCompany, setNewCompany] = useState({}); // State for new company
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(null);
  const { data: clientData, fetchGet: clientFetchGet } = useGet();
  const { fetchPut: clientUpdateFetchPut } = usePut();

  const params = useParams();

  useEffect(() => {
    clientFetchGet(`/clients/clientDetail/${params.id}`);
  }, []);

  useEffect(() => {
    if (clientData) {
      setClientToEdit(clientData.client);
    }
  }, [clientData]);

  const openModal = (companyIndex) => {
    setCurrentCompanyIndex(companyIndex);
    setNewAddress({
      deliveryContactName: "",
      deliveryContactPhone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZipCode: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewAddress({});
    setCurrentCompanyIndex(null);
  };

  const openCompanyModal = () => {
    setNewCompany({
      vatName: "",
      vatNumber: "",
      deliveryAddresses: [],
    });
    setShowCompanyModal(true);
  };

  const closeCompanyModal = () => {
    setShowCompanyModal(false);
    setNewCompany({});
  };

  const handleNewAddressChange = (field, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewCompanyChange = (field, value) => {
    setNewCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addDeliveryAddress = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName[currentCompanyIndex].deliveryAddresses = [
      ...(updatedClient.companyName[currentCompanyIndex].deliveryAddresses || []),
      newAddress,
    ];
    setClientToEdit(updatedClient);
    closeModal();
  };

  const addNewCompany = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName = [...(updatedClient.companyName || []), newCompany];
    setClientToEdit(updatedClient);
    closeCompanyModal();
  };

  const saveClientChanges = async () => {
    await clientUpdateFetchPut(`/clients/clientUpdate/${params.id}`, clientToEdit);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="rounded border p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-500">Detalles Cliente</h2>
          <Link
            className="rounded bg-indigo-500 px-2 py-1.5 text-xs text-white hover:bg-indigo-600"
            to="/clients"
          >
            Ir a Clientes
          </Link>
        </div>
      </div>

      {/* Client Information */}
      <div className="rounded border p-6 bg-white shadow-sm space-y-6">
        {/* Commercial Client Name */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-500">Cliente:</h3>
            <EditIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {clientToEdit?.commercialClientName || "N/A"}
          </p>
        </div>

        {/* Company Information */}
        {clientToEdit?.companyName?.map((company, index) => (
          <div key={index} className="border-t py-4">
            <h3 className="text-lg font-medium text-gray-500">Razón Social {index + 1}</h3>
            <div className="pl-4">
              <p className="text-base text-gray-800">
                <span className="font-semibold">Nombre fiscal:</span> {company.vatName || "N/A"}
              </p>
              <p className="text-base text-gray-800">
                <span className="font-semibold">Número fiscal:</span> {company.vatNumber || "N/A"}
              </p>
            </div>

            {/* Delivery Addresses */}
            {company.deliveryAddresses?.map((address, addressIndex) => (
              <div key={addressIndex} className="pl-4 space-y-2 border-t pt-4">
                <h4 className="text-base font-medium text-gray-500">
                  Dirección de entrega {addressIndex + 1}
                </h4>
                <div className="space-y-1 lg:flex lg:justify-left lg: space-x-10">
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Contacto:</span>{" "}
                      {address.deliveryContactName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Teléfono:</span>{" "}
                      {address.deliveryContactPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Estado:</span> {address.deliveryState || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Ciudad:</span> {address.deliveryCity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Código postal:</span>{" "}
                      {address.deliveryZipCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Delivery Address Button */}
            <button
              type="button"
              onClick={() => openModal(index)}
              className="mt-4 text-sm text-blue-500 hover:underline"
            >
              + Agregar Dirección de Entrega
            </button>
          </div>
        ))}

        {/* Add New Company Button */}
        <button
          type="button"
          onClick={openCompanyModal}
          className="mt-6 text-sm text-blue-500 hover:underline"
        >
          + Añadir Nueva Razón Social
        </button>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            onClick={saveClientChanges}
            className="text-sm rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Modal for Adding Delivery Address */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96 shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Agregar Dirección de Entrega</h3>
            <input
              type="text"
              placeholder="Contacto"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryContactName}
              onChange={(e) => handleNewAddressChange("deliveryContactName", e.target.value)}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryContactPhone}
              onChange={(e) => handleNewAddressChange("deliveryContactPhone", e.target.value)}
            />
            <input
              type="text"
              placeholder="Dirección"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryAddress}
              onChange={(e) => handleNewAddressChange("deliveryAddress", e.target.value)}
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryCity}
              onChange={(e) => handleNewAddressChange("deliveryCity", e.target.value)}
            />
            <input
              type="text"
              placeholder="Estado"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryState}
              onChange={(e) => handleNewAddressChange("deliveryState", e.target.value)}
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="w-full border rounded px-3 py-2"
              value={newAddress.deliveryZipCode}
              onChange={(e) => handleNewAddressChange("deliveryZipCode", e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600"
                onClick={addDeliveryAddress}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Company */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96 shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Añadir Nueva Razón Social</h3>
            <input
              type="text"
              placeholder="Razón Social"
              className="w-full border rounded px-3 py-2"
              value={newCompany.vatName}
              onChange={(e) => handleNewCompanyChange("vatName", e.target.value)}
            />
            <input
              type="text"
              placeholder="RFC"
              className="w-full border rounded px-3 py-2"
              value={newCompany.vatNumber}
              onChange={(e) => handleNewCompanyChange("vatNumber", e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeCompanyModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600"
                onClick={addNewCompany}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

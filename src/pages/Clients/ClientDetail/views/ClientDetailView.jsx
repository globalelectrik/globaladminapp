import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import useGet from '../../../../hooks/useGet/useGet';
import usePut from '../../../../hooks/usePut/usePut';
import ResultMessageBox from '../../../../components/MessageBox/ResultMessageBox.jsx';
import AddCompanyModal from './../../ClientsComponents/CreateClient/AddCompanyModal.jsx';
import AddDeliveryAddressModal from './../../ClientsComponents/CreateClient/AddDeliveryAddressModal.jsx';
import EditDeliveryAddressModal from './../../ClientsComponents/CreateClient/EditDeliveryAddressModal.jsx';
import EditCompanyModal from './../../ClientsComponents/CreateClient/EditCompanyModal.jsx';


export default function ClientDetailView() {
  const [clientToEdit, setClientToEdit] = useState("");

  const [showDeliveryAddressModal, setShowDeliveryAddressModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showEditDeliveryAddressModal, setShowEditDeliveryAddressModal] = useState(false);
  const [showResultMessageBox, setShowResultMessageBox] = useState(false);

  const [newAddress, setNewAddress] = useState({});
  const [newCompany, setNewCompany] = useState({});

  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(null);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null); 

  const [backendMessage, setBackendMessage] = useState("");
  const [backendResultType, setBackendResultType] = useState("")

  const [showContacts, setShowContacts] = useState(false);

  
  const { data: clientData, fetchGet: clientFetchGet } = useGet();
  const { putResponse: updatedClientData, fetchPut: clientUpdateFetchPut } = usePut();
  const { data: contactsData, fetchGet: contactsFetchGet } = useGet();
  
  
  const params = useParams();

  
const toggleContactsButtonHandler = () => {
  if (!showContacts) {
    contactsFetchGet(`/contacts/clientContacts/${params.id}`);
  }
  setShowContacts(!showContacts);
};

  useEffect(() => {
    clientFetchGet(`/clients/clientDetail/${params.id}`);
  }, []);

  useEffect(() => {
    if (clientData) {
      setClientToEdit(clientData.client);
    }
  }, [clientData]);

  const openNewDeliveryAddressModal = (companyIndex) => {
    setCurrentCompanyIndex(companyIndex);
    setNewAddress({
      aliasDeliveryAddress: "",
      deliveryContactPhone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZipCode: "",
    });
    setShowDeliveryAddressModal(true);
  };

  const closeDeliveryAddressModal = () => {
    setShowDeliveryAddressModal(false);
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
    closeDeliveryAddressModal();
  };

  const addNewCompany = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName = [...(updatedClient.companyName || []), newCompany];
    setClientToEdit(updatedClient);
    closeCompanyModal();
  };

  const saveClientChanges = async () => {
    await clientUpdateFetchPut(`/clients/clientUpdate/${params.id}`, clientToEdit);
    // setBackendMessage(clientUpdateFetchPut.)
  };

  const saveEditedAddress = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName[currentCompanyIndex].deliveryAddresses[currentAddressIndex] = newAddress;
    setClientToEdit(updatedClient);
    setShowEditDeliveryAddressModal(false); // Close the modal after saving
  };

  const saveEditedCompany = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName[currentCompanyIndex] = newCompany;
    setClientToEdit(updatedClient);
    setShowEditCompanyModal(false)
  };

  const openEditAddressModal = (companyIndex, addressIndex) => {
    setCurrentCompanyIndex(companyIndex);
    setCurrentAddressIndex(addressIndex);
    setNewAddress(clientToEdit.companyName[companyIndex].deliveryAddresses[addressIndex]);
    setShowEditDeliveryAddressModal(true); // Show the modal
  };

  const openEditCompanyModal = (companyIndex) => {
    setCurrentCompanyIndex(companyIndex);
    setNewCompany(clientToEdit.companyName[companyIndex])
    setShowEditCompanyModal(true);
  };


  useEffect(()=> {
    if(updatedClientData){
      setBackendMessage(updatedClientData.message)
      setShowResultMessageBox(true)
    }
  }, [updatedClientData])






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
            <button className="text-indigo-600 text-sm" onClick={toggleContactsButtonHandler}>
              {showContacts ? "Ocultar Contactos" : "Ver Contactos"}
            </button>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {clientToEdit?.commercialClientName || "N/A"}
          </p>
          {showContacts && contactsData?.contacts && (
            <div className="mt-1 border-t pt-2">
              <h3 className="text-md font-medium text-gray-500 mb-2">Contactos Relacionados</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded shadow-sm bg-white">
                  <thead className="bg-gray-100 text-left">
                    <tr className='text-sm'>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Correo</th>
                      <th className="p-3">Móvil</th>
                      <th className="p-3">Teléfono</th>
                      <th className="p-3">Cargo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsData.contacts.map((contact) => (
                      <tr key={contact.id} className="border-t text-sm">
                        <td className="p-3">{contact.contactName}</td>
                        <td className="p-3">{contact.email}</td>
                        <td className="p-3">{contact.mobile}</td>
                        <td className="p-3">{contact.telephone}</td>
                        <td className="p-3">{contact.position}</td>
                      </tr>
                    ))}
                    {!contactsData.contacts.length && (
                      <tr>
                        <td colSpan="5" className="p-3 text-center text-gray-500">
                          No hay contactos asociados a este cliente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
               <button
                type="button"
                onClick={() => openEditCompanyModal(index)}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Editar Razón Social
              </button>
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
                      <span className="font-semibold">Alias:</span>{" "}
                      {address.aliasDeliveryAddress || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Dirección:</span>{" "}
                      {address.deliveryAddress || "N/A"}
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
                {/* Edit Delivery Address Button */}
                <button
                  type="button"
                  onClick={() => openEditAddressModal(index, addressIndex)}  // Open edit modal for this address
                  className="mt-4 text-sm text-blue-500 hover:underline"
                >
                  Editar Dirección
                </button>
              </div>
            ))}

            {/* Add New Delivery Address Button */}
            <button
              type="button"
              onClick={() => openNewDeliveryAddressModal(index)}
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

      {/* Modals */}

      {showDeliveryAddressModal && (
        <AddDeliveryAddressModal
          newAddress={newAddress}
          showDeliveryAddressModal={showDeliveryAddressModal}
          setShowDeliveryAddressModal={setShowDeliveryAddressModal}
          closeDeliveryAddressModal={closeDeliveryAddressModal}
          handleNewAddressChange={handleNewAddressChange}
          addDeliveryAddress={addDeliveryAddress}
        />
      )}

      {showEditDeliveryAddressModal && (
        <EditDeliveryAddressModal
          newAddress={newAddress}
          showDeliveryAddressModal={showEditDeliveryAddressModal}
          setShowEditDeliveryAddressModal={setShowEditDeliveryAddressModal}
          handleNewAddressChange={handleNewAddressChange}
          saveEditedAddress={saveEditedAddress}
        />
      )}

      {showCompanyModal && (
        <AddCompanyModal
          newCompany={newCompany}
          showCompanyModal={showCompanyModal}
          setShowCompanyModal={setShowCompanyModal}
          closeCompanyModal={closeCompanyModal}
          handleNewCompanyChange={handleNewCompanyChange}
          addNewCompany={addNewCompany}
        />
      )}
      
      {showEditCompanyModal && (
        <EditCompanyModal
          newCompany={newCompany}
          showEditCompanyModal={showEditCompanyModal}
          setShowEditCompanyModal={setShowEditCompanyModal}
          handleNewCompanyChange={handleNewCompanyChange}
          saveEditedCompany={saveEditedCompany}
        />
      )}

      {showResultMessageBox && ( 
        <ResultMessageBox
          backendMessage = {backendMessage}
          backendResultType = {backendResultType}
          showResultMessageBox= {showResultMessageBox}
          setShowResultMessageBox= {setShowResultMessageBox}
        />
      )}

    </div>
  );
}

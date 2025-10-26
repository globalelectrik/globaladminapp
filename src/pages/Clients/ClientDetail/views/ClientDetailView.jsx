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
  const [contactsData, setContactsData] = useState("")
  const [deliveryContactSelected, setDeliveryContactSelected] = useState("")


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
  
  const { 
    data: clientData, 
    fetchGet: clientFetchGet
   } = useGet();
   
  const { 
    putResponse: updatedClientData, 
    fetchPut: clientUpdateFetchPut 
  } = usePut();

  
  const params = useParams();

  
const toggleContactsButtonHandler = () => {
  setShowContacts(!showContacts);
};

  useEffect(() => {
    clientFetchGet(`/clients/clientDetail/${params.id}`);
  }, []);

  useEffect(() => {
    if (clientData) {
      setClientToEdit(clientData.client);
      setContactsData(clientData.client.clientContacts)
    }
  }, [clientData]);

  const openNewDeliveryAddressModal = (companyIndex) => {
    setCurrentCompanyIndex(companyIndex);
    setNewAddress({
      deliveryContactName:"",
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
      companyCountry: "MEX",
      companyRegime: "",
      companyZipCode: "",
      companyEmail: "",
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

    newAddress.deliveryContact = deliveryContactSelected // --> aqui se hace update de la deliveryContactName seleccionada antes de pasarlo al back
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
  };

  console.log("clientToEdit --> ",clientToEdit);

  const saveEditedAddress = () => {
    const updatedClient = { ...clientToEdit };
    newAddress.deliveryContact = deliveryContactSelected
    updatedClient.companyName[currentCompanyIndex].deliveryAddresses[currentAddressIndex] = newAddress;
    setClientToEdit(updatedClient);
    setShowEditDeliveryAddressModal(false); // Close the modal after saving
    setDeliveryContactSelected("")
  };

  const saveEditedCompany = () => {
    const updatedClient = { ...clientToEdit };
    updatedClient.companyName[currentCompanyIndex] = newCompany;
    setClientToEdit(updatedClient);
    setShowEditCompanyModal(false)
    setDeliveryContactSelected("")
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


    const regimeOptions = [
    { value: "601", label: "601 — General de Ley Personas Morales" },
    { value: "603", label: "603 — Personas Morales con Fines no Lucrativos" },
    { value: "605", label: "605 — Sueldos y Salarios e Ingresos Asimilados a Salarios" },
    { value: "606", label: "606 — Arrendamiento" },
    { value: "607", label: "607 — Régimen de Enajenación o Adquisición de Bienes" },
    { value: "608", label: "608 — Demás ingresos" },
    { value: "610", label: "610 — Residentes en el Extranjero sin EP en México" },
    { value: "611", label: "611 — Ingresos por Dividendos (socios y accionistas)" },
    { value: "612", label: "612 — Personas Físicas con Actividades Empresariales y Profesionales" },
    { value: "614", label: "614 — Ingresos por intereses" },
    { value: "615", label: "615 — Régimen de los ingresos por obtención de premios" },
    { value: "616", label: "616 — Sin obligaciones fiscales" },
    { value: "620", label: "620 — Sociedades Cooperativas de Producción (diferimiento)" },
    { value: "621", label: "621 — Incorporación Fiscal" },
    { value: "622", label: "622 — Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
    { value: "623", label: "623 — Opcional para Grupos de Sociedades" },
    { value: "624", label: "624 — Coordinados" },
    { value: "625", label: "625 — Actividades Empresariales vía Plataformas Tecnológicas" },
    { value: "626", label: "626 — Régimen Simplificado de Confianza" },
  ];





  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-2">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Detalles del Cliente
              </h2>
              <p className="text-sm text-gray-500 mt-1">Información completa y gestión del cliente</p>
            </div>
            <Link
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105"
              to="/clients"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ir a Clientes
            </Link>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-4 space-y-2">

        {/* Commercial Client Name */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-6 border border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nombre Comercial del Cliente:
            </h3>
            <button 
              className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105 shadow-sm"
              onClick={toggleContactsButtonHandler}
            >
              {showContacts ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  Ocultar Contactos
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Contactos
                </>
              )}
            </button>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {clientToEdit?.commercialClientName || "N/A"}
          </p>

          {/* SHOW Contacts */}
          {showContacts && contactsData && (
            <div className="mt-6 border-t border-indigo-100 pt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Contactos Relacionados
              </h3>
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr className='text-sm text-gray-700'>
                      <th className="p-4 text-left font-semibold">Nombre</th>
                      <th className="p-4 text-left font-semibold">Correo</th>
                      <th className="p-4 text-left font-semibold">Móvil</th>
                      <th className="p-4 text-left font-semibold">Teléfono</th>
                      <th className="p-4 text-left font-semibold">Cargo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contactsData?.map((contact) => (
                      <tr key={contact.id} className="text-sm hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-4 font-medium text-gray-900">{contact.contactName}</td>
                        <td className="p-4 text-gray-600">{contact.email}</td>
                        <td className="p-4 text-gray-600">{contact.mobile}</td>
                        <td className="p-4 text-gray-600">{contact.telephone}</td>
                        <td className="p-4 text-gray-600">{contact.position}</td>
                      </tr>
                    ))}
                    {!contactsData?.length && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
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
          <div key={index} className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Razón Social {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => openEditCompanyModal(index)}
                className="inline-flex items-center px-3 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105 shadow-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nombre fiscal</p>
                <p className="text-base font-semibold text-gray-800">{company.vatName || "N/A"}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Número fiscal RFC</p>
                <p className="text-base font-semibold text-gray-800">{company.vatNumber || "N/A"}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Régimen</p>
                <p className="text-base font-semibold text-gray-800">{company.companyRegime || "N/A"}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">País</p>
                <p className="text-base font-semibold text-gray-800">{company.companyCountry || "N/A"}</p>
              </div>
            </div>

{/* Delivery Addresses */}

            {company.deliveryAddresses?.map((address, addressIndex) => (
              <div key={addressIndex} className="mt-4 bg-gradient-to-br from-green-50 to-white rounded-lg p-5 border border-green-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-base font-semibold text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Dirección de entrega {addressIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => openEditAddressModal(index, addressIndex)}
                    className="inline-flex items-center px-3 py-1.5 bg-white text-green-600 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Alias</p>
                      <p className="text-sm font-semibold text-gray-800">{address.aliasDeliveryAddress || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Contacto Entrega</p>
                      <p className="text-sm font-semibold text-gray-800">{address?.deliveryContact?.contactName || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                      <p className="text-sm font-semibold text-gray-800">{address.deliveryAddress || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                      <p className="text-sm font-semibold text-gray-800">{address?.deliveryContact?.telephone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                      <p className="text-sm font-semibold text-gray-800">{address.deliveryState || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ciudad</p>
                      <p className="text-sm font-semibold text-gray-800">{address.deliveryCity || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Código postal</p>
                      <p className="text-sm font-semibold text-gray-800">{address.deliveryZipCode || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Delivery Address Button */}
            <div className='flex justify-end'>
              <button
                type="button"
                onClick={() => openNewDeliveryAddressModal(index)}
                className="mt-4 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Dirección de Entrega
              </button>
            </div>

          </div>
        ))}

        {/* Add New Company Button */}
        <div className='flex justify-center'>
          <button
            type="button"
            onClick={openCompanyModal}
            className="mt-6 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Nueva Razón Social
          </button>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={saveClientChanges}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-base font-medium rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Modals */}

      {showDeliveryAddressModal && (
        <AddDeliveryAddressModal
          newAddress={newAddress}
          contactsData={contactsData}
          deliveryContactSelected={deliveryContactSelected}
          setDeliveryContactSelected={setDeliveryContactSelected}
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
          contactsData={contactsData}
          deliveryContactSelected={deliveryContactSelected}
          setDeliveryContactSelected={setDeliveryContactSelected}
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
    </div>
  );
}

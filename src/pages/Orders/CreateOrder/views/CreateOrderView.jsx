import { useEffect, useState } from 'react';
import usePost from "./../../../../hooks/usePost/usePost";
import useGet from "./../../../../hooks/useGet/useGet";
import ClientsComboBox from '../../../Clients/ClientsComponents/ClientsComboBox/ClientsComboBox';
import CompaniesComboBox from '../../../Clients/ClientsComponents/CompaniesComboBox/CompaniesComboBox';
import { formatCurrency } from './../../../../helpers/formatCurrency';
import MaterialsTable from '../CreateOrderComponents/MaterialsTable/MaterialsTable';
import ContactsComboBox from '../../../Contacts/ContactsComponents/ContactsComboBox';
import { Link } from 'react-router-dom';
import DeliveryAddressComboBox from '../CreateOrderComponents/DeliveryAddressComboBox/DeliveryAddressComboBox';
import { useAuthContext } from '../../../../context/AuthContext';
import CreatedOrderModal from '../CreateOrderComponents/CreatedOrderModal/CreatedOrderModal';

export default function CreateOrderView() {
  const [clientSelected, setClientSelected] = useState(null);
  const [companySelected, setCompanySelected] = useState(null);
  const [contactSelected, setContactSelected] = useState(null);

  const [orderNumGlobal, setOrderNumGlobal] = useState('');
  const [quotNumGlobal, setQuotNumGlobal] = useState('');
  const [datePOClient, setDatePOClient] = useState('');
  const [pOClientNumber, setPOClientNumber] = useState('');
  const [clientCreditDays, setClientCreditDays] = useState('');
  const [deliverInDays, setDeliverInDays] = useState(12);
  const [deliveryAddresses, setDeliveryAddresses] = useState("")
  const [deliveryAddressSelected, setDeliveryAddressSelected] = useState("")

  const [orderTotal, setOrderTotal] = useState('');
  const [orderTotalPlusTax, setOrderTotalPlusTax] = useState('');

  const [materials, setMaterials] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuthContext();

  const {
    data: clientsData,
    fetchGet: clientsFetchGet,
  } = useGet();

  const { data: classificationsData, fetchGet: classificationsFetchGet } = useGet();
  const { data: brandsData, fetchGet: brandsFetchGet } = useGet();
  const { data: contactsData, fetchGet: contactsFetchGet } = useGet();

  const {
    postResponse: createOrderPostResponse,
    isLoading: createOrderIsLoading,
    fetchPost: createOrderFetchPost,
  } = usePost();

  useEffect(() => { clientsFetchGet("/clients"); }, []);

  const handleCreateOrder = async () => {

    const errors = [];

    if (!quotNumGlobal.trim()) errors.push("Número de cotización");
    if (!datePOClient) errors.push("Fecha de pedido");
    if (!pOClientNumber.trim()) errors.push("Orden de compra del cliente");
    if (!clientSelected) errors.push("Cliente");
    if (!companySelected) errors.push("Empresa");
    if (!deliveryAddressSelected) errors.push("Dirección de entrega");
    if (!clientCreditDays) errors.push("Días de crédito");
    if (!orderTotal) errors.push("Total de la orden");
    if (!contactSelected) errors.push("Contacto de entrega");

    if (!materials.length) {
      errors.push("Debes añadir al menos un material");
    } else {
      materials.forEach((material, index) => {
        if (!material.materialName) errors.push(`Material ${index + 1}: Nombre`);
        if (!material.materialBrand) errors.push(`Material ${index + 1}: Marca`);
        if (!material.materialReference) errors.push(`Material ${index + 1}: Referencia`);
        if (!material.materialClassification) errors.push(`Material ${index + 1}: Clasificación`);
        if (!material.materialStatusType) errors.push(`Material ${index + 1}: Estado`);
        if (!material.materialClientReference) errors.push(`Material ${index + 1}: Ref. Cliente`);
      });
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const dataToSend = {
      quotNumGlobal,
      datePOClient,
      pOClientNumber,
      client: clientSelected,
      company: companySelected,
      deliveryAddress: deliveryAddressSelected,
      deliverInDays: Number(deliverInDays) || 12,
      orderTotal,
      orderTotalPlusTax,
      materials,
      clientCreditDays,
      user: user.email,
    };

   await createOrderFetchPost("/orders/createOrder", dataToSend);
  };

  useEffect(() => {
    if (clientSelected) {
      setCompanySelected("");
      setContactSelected("");
      classificationsFetchGet('/materials/getClassifications');
      contactsFetchGet(`/contacts/clientContacts/${clientSelected?.id}`);
      brandsFetchGet('/materials/getBrands');
    }
  }, [clientSelected]);

  useEffect(() => {
    setDeliveryAddressSelected("");
    setDeliveryAddresses(companySelected?.deliveryAddresses);
  }, [companySelected]);

  useEffect(() => {
    setOrderTotalPlusTax(parseFloat((orderTotal * 1.16).toFixed(2)));
  }, [orderTotal]);

  useEffect(() => {
    if (createOrderPostResponse?.message === "success") {
      setIsModalOpen(true);

      // Clear fields
      setClientSelected(null);
      setCompanySelected(null);
      setContactSelected(null);
      setOrderNumGlobal('');
      setQuotNumGlobal('');
      setDatePOClient('');
      setPOClientNumber('');
      setClientCreditDays('');
      setDeliverInDays(12);
      setDeliveryAddresses('');
      setDeliveryAddressSelected('');
      setOrderTotal('');
      setOrderTotalPlusTax('');
      setMaterials([]);
    }
  }, [createOrderPostResponse]);

  return (
    <>
        <CreatedOrderModal
          isOpen={isModalOpen}
          createOrderPostResponse={createOrderPostResponse}
        />
      <div className='relative overflow-visible'>
        <div className='flex justify-between pb-2'>
          <p className='text-xl text-indigo-600'>Crear Pedido</p>
           <Link className="rounded bg-indigo-500 px-2 py-1.5 text-xs text-white hover:bg-indigo-600" to="/orders">
              Ir a Pedidos
            </Link>
        </div>

         {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-400 text-red-700 rounded p-4 my-4 text-sm space-y-1">
            <p className="font-semibold">Por favor completa los siguientes campos:</p>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Client and Company Selection */}
        <div className='flex flex-col lg:flex-row lg:justify-between lg:space-x-4 space-y-2 lg:space-y-0'>
          <div className='flex items-center justify-start space-x-2 w-full'>
            <span className='inline-block w-1/3'>Cliente</span>
            <ClientsComboBox
              className='w-2/3'
              clients={clientsData?.clients}
              clientSelected={clientSelected}
              setClientSelected={setClientSelected}
            />
          </div>

          <div className='flex items-center justify-start space-x-2 w-full'>
            <label className='inline-block w-1/3'>Empresa</label>
            <CompaniesComboBox
              className='w-2/3'
              clientSelected={clientSelected}
              companySelected={companySelected}
              setCompanySelected={setCompanySelected}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 mt-4'>
          <div className='flex items-center'>
            <label className='inline-block w-1/3'>Dirección de Entrega</label>
            <DeliveryAddressComboBox
              className='w-2/3'
              deliveryAddresses={deliveryAddresses}
              deliveryAddressSelected={deliveryAddressSelected}
              setDeliveryAddressSelected={setDeliveryAddressSelected}
            />
          </div>
          <div className='align-middle rounded-md bg-slate-50 p-3 shadow-sm border-slate-200 border'>
            { deliveryAddressSelected ? (
              <div className='text-sm align-middle'>
                <div className='flex justify-between'><p className='font-bold'>Alias:</p> <p className='text-right'>{deliveryAddressSelected.aliasDeliveryAddress}</p></div>
                <div className='flex justify-between'><p className='font-bold'>Dirección:</p> <p className='text-right'>{deliveryAddressSelected.deliveryAddress}</p></div>
                <div className='flex justify-between'><p className='font-bold'>Ciudad:</p> <p className='text-right'>{deliveryAddressSelected.deliveryCity}</p></div>
                <div className='flex justify-between'><p className='font-bold'>Estado:</p> <p className='text-right'>{deliveryAddressSelected.deliveryState}</p></div>
                <div className='flex justify-between'><p className='font-bold'>C.P.:</p> <p className='text-right'>{deliveryAddressSelected.deliveryZipCode}</p></div>
              </div>
                
                ) : 
            (<p className='text-sm align-middle'> Selecciona una dirección de entrega </p>)}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          
          {/* Número de cotización */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Cotización GE</label>
            <input
              type='text'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800 placeholder-gray-300'
              value={quotNumGlobal}
              placeholder='2145_v2'
              onChange={(e) => setQuotNumGlobal(e.target.value)}
            />
          </div>

          {/* Fecha de pedido */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Fecha de pedido</label>
            <input
              type='date'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={datePOClient}
              onChange={(e) => setDatePOClient(e.target.value)}
            />
          </div>

          {/* Pedido del cliente */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Num Orden Compra de Cliente</label>
            <input
              type='text'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={pOClientNumber}
              onChange={(e) => setPOClientNumber(e.target.value)}
            />
          </div>

           {/* Pedido del cliente */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Días Entrega Promesa</label>
            <input
              type='text'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={deliverInDays}
              onChange={(e) => setDeliverInDays(e.target.value)}
            />
          </div>

          {/* Días de crédito */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Días de crédito</label>
            <input
              type='number'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={clientCreditDays}
              onChange={(e) => setClientCreditDays(e.target.value)}
            />
          </div>

          {/* Total de la orden */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Total antes de IVA</label>
            <div className='inline-block w-2/3'>
              <input
                type='number'
                className='w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
                value={orderTotal}
                onChange={(e) => setOrderTotal(e.target.value)}
              />
              <p>Total+IVA (16%) {formatCurrency(orderTotalPlusTax)}</p>
            </div>
          </div>
          
           {/* Contacto de entrega del paquete*/}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Contacto entrega</label>
              <ContactsComboBox
                contacts={contactsData?.contacts}
                contactSelected={contactSelected}
                setContactSelected={setContactSelected}
              />
          </div>

        </div>

            {/* Materials Table Component */}
           <MaterialsTable 
            materials={materials} 
            setMaterials={setMaterials} 
            classificationsData={classificationsData}
            brandsData={brandsData}
            />

            
        <div className='flex justify-end'>
           <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm disabled:opacity-50"
              onClick={handleCreateOrder}
              disabled={createOrderIsLoading}
            >
              Crear Pedido
            </button>
          </div>

         
      </div>
    </>
  );
}

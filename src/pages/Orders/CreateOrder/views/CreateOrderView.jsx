import { useEffect, useState } from 'react';
import usePost from "./../../../../hooks/usePost/usePost";
import useGet from "./../../../../hooks/useGet/useGet";
import ClientsComboBox from '../../../../components/Clients/ClientsComboBox/ClientsComboBox';
import CompaniesComboBox from '../../../../components/Clients/CompaniesComboBox/CompaniesComboBox';
import { formatCurrency } from './../../../../helpers/formatCurrency';
import MaterialsTable from '../../../../components/Orders/CreateOrder/MaterialsTable/MaterialsTable';
import ContactsComboBox from './../../../../components/Contacts/ContactsComboBox/ContactsComboBox';
import { Link } from 'react-router-dom';
import DeliveryAddressComboBox from '../../../../components/Orders/CreateOrder/DeliveryAddressComboBox/DeliveryAddressComboBox';
import { useAuthContext } from '../../../../context/AuthContext';

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

  const { user } = useAuthContext()

  const {
    data: clientsData,
    isLoading: clientsIsLoading,
    error: clientsError,
    fetchGet: clientsFetchGet,
  } = useGet();

  const {
    data: classificationsData,
    isLoading: classificationsIsLoading,
    error: classificationsError,
    fetchGet: classificationsFetchGet,
  } = useGet();

    const {
    data: brandsData,
    isLoading: brandsIsLoading,
    error: brandsError,
    fetchGet: brandsFetchGet,
  } = useGet();
  
  const { 
    data: contactsData, 
    fetchGet: contactsFetchGet
   } = useGet();

  const {
    postResponse: createOrderPostResponse,
    isLoading: createOrderIsLoading,
    error: createOrderError,
    fetchPost: createOrderFetchPost,
  } = usePost();
  
  useEffect(() => {
    clientsFetchGet("/clients");
  }, []);

  const handleCreateOrder = async () => {

    const dataToSend = {
      orderNumGlobal:orderNumGlobal, 
      quotNumGlobal: quotNumGlobal,
      datePOClient: datePOClient,
      pOClientNumber:pOClientNumber,
      client:clientSelected,
      company: companySelected,
      deliveryAddress: deliveryAddressSelected,
      deliverInDays: 12,
      orderTotal:orderTotal,
        materials: materials,
      clientCreditDays:clientCreditDays,
      user: user.id
    }

    console.log(dataToSend);
    await createOrderFetchPost("/orders/createOrder", dataToSend)
  }

  useEffect(() => {
    setCompanySelected("")
    setContactSelected("")
    classificationsFetchGet('/materials/getClassifications');
    contactsFetchGet(`/contacts/clientContacts/${clientSelected?.id}`);
    brandsFetchGet('/materials/getBrands');
  }, [clientSelected]);

  useEffect(() => {
    setDeliveryAddressSelected("")
    setDeliveryAddresses(companySelected?.deliveryAddresses)
  }, [companySelected]);
  
  useEffect(() => {
    setOrderTotalPlusTax(parseFloat((orderTotal * 1.16).toFixed(2)));
  }, [orderTotal]);

  return (
    <>
      <div className='relative overflow-visible'>
        <div className='flex justify-between pb-2'>
          <p className='text-xl text-indigo-600'>Crear Pedido</p>
           <Link className="rounded bg-indigo-500 px-2 py-1.5 text-xs text-white hover:bg-indigo-600" to="/orders">
              Ir a Pedidos
            </Link>
        </div>

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
          {/* Número de orden */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Orden GE</label>
            <input
              type='text'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={orderNumGlobal}
              onChange={(e) => setOrderNumGlobal(e.target.value)}
            />
          </div>

          {/* Número de cotización */}
          <div className='flex items-center space-x-2'>
            <label className='inline-block w-1/3'>Número de cotización GE</label>
            <input
              type='text'
              className='w-2/3 rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-800 focus:border-indigo-800'
              value={quotNumGlobal}
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
            <label className='inline-block w-1/3'>Num Pedido Cliente</label>
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
           <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm" onClick={handleCreateOrder}>
            Crear Pedido
          </button>
        </div>

         
      </div>
    </>
  );
}

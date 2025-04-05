import { useEffect, useState } from 'react';
import usePost from "../../../../hooks/usePost/usePost";
import useGet from "../../../../hooks/useGet/useGet";
import ClientsComboBox from '../../../../components/Clients/ClientsComboBox/ClientsComboBox';
import CompaniesComboBox from '../../../../components/Clients/CompaniesComboBox/CompaniesComboBox';
import { formatCurrency } from '../../../../helpers/formatCurrency';
import MaterialsTable from '../../../../components/CreateOrder/MaterialsTable';

export default function CreateOrderView() {

  const [clientSelected, setClientSelected] = useState(null);
  const [companySelected, setCompanySelected] = useState(null);


  const [quotNumGlobal, setQuotNumGlobal] = useState('');
  const [datePOClient, setDatePOClient] = useState('');
  const [pOClientNumber, setPOClientNumber] = useState('');
  const [clientCreditDays, setClientCreditDays] = useState('');
  
  
  const [orderTotal, setOrderTotal] = useState('');
  const [orderTotalPlusTax, setOrderTotalPlusTax] = useState('');


  const [materials, setMaterials] = useState([]);


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




  useEffect(() => {
    clientsFetchGet("/clients");
  }, []);

  useEffect(() => {
    setCompanySelected("")
    classificationsFetchGet('/materials/getClassifications');
    brandsFetchGet('/materials/getBrands');
  }, [clientSelected]);
  
  useEffect(() => {
    setOrderTotalPlusTax(parseFloat((orderTotal * 1.16).toFixed(2)));
  }, [orderTotal]);

  return (
    <>
      <div>
        <div className='pb-2'>
          <p className='text-2xl text-indigo-600'>Crear Pedido</p>
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
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
              <p>Total+IVA: {formatCurrency(orderTotalPlusTax)}</p>
            </div>
          </div>

        </div>
            {/* Materials Table Component */}
           <MaterialsTable 
            materials={materials} 
            setMaterials={setMaterials} 
            classificationsData={classificationsData}
            brandsData={brandsData}
            />
      </div>
    </>
  );
}

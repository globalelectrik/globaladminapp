import { useEffect, useState } from 'react';
import usePost from "./../../../../hooks/usePost/usePost";
import useGet from "./../../../../hooks/useGet/useGet";
import usePostWithFiles from "./../../../../hooks/usePostWithFiles/usePostWithFiles";
import ClientsComboBox from '../../../Clients/ClientsComponents/ClientsComboBox/ClientsComboBox';
import CompaniesComboBox from '../../../Clients/ClientsComponents/CompaniesComboBox/CompaniesComboBox';
import { formatCurrency } from './../../../../utils/helpers/formatCurrency';
import { getCurrentDate } from './../../../../utils/helpers/getCurrentDate';
import MaterialsTable from '../CreateOrderComponents/MaterialsTable/MaterialsTable';
import ContactsComboBox from '../../../Contacts/ContactsComponents/ContactsComboBox';
import { Link } from 'react-router-dom';
import DeliveryAddressComboBox from '../CreateOrderComponents/DeliveryAddressComboBox/DeliveryAddressComboBox';
import { useAuthContext } from '../../../../context/AuthContext';
import CreatedOrderModal from '../CreateOrderComponents/CreatedOrderModal/CreatedOrderModal';
import Spin from '../../../../components/Spin/Spin';
import { extractMaterialsXls } from '../helpers/extractMaterialsXls';


export default function CreateOrderView() {
  const [clientSelected, setClientSelected] = useState(null);
  const [companySelected, setCompanySelected] = useState(null);

  const [orderNumGlobal, setOrderNumGlobal] = useState('');
  const [quotNumGlobal, setQuotNumGlobal] = useState('');
  const [datePOClient, setDatePOClient] = useState(getCurrentDate());
  const [pOClientNumber, setPOClientNumber] = useState('');
  const [clientCreditDays, setClientCreditDays] = useState('');
  const [deliverInDays, setDeliverInDays] = useState(12);
  const [deliveryAddresses, setDeliveryAddresses] = useState("")
  const [deliveryAddressSelected, setDeliveryAddressSelected] = useState("")

  const [orderTotal, setOrderTotal] = useState(0);
  const [orderTotalPlusTax, setOrderTotalPlusTax] = useState(0);

  const [materials, setMaterials] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // File upload states
  const [quotationFile, setQuotationFile] = useState(null);
  const [purchaseOrderFile, setPurchaseOrderFile] = useState(null);
  const [isDragOverQuotation, setIsDragOverQuotation] = useState(false);
  const [isDragOverPurchaseOrder, setIsDragOverPurchaseOrder] = useState(false);
  const [isExtractingMaterials, setIsExtractingMaterials] = useState(false);

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
    error: createOrderError,
    fetchPostWithFiles: createOrderFetchPost,
  } = usePostWithFiles();

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

    if (!materials.length) {
      errors.push("Debes añadir al menos un material");
    } else {
      materials.forEach((material, index) => {
        if (!material.materialName) errors.push(`Material ${index + 1}: Nombre`);
        if (!material.quantity) errors.push(`Material ${index + 1}: Cantidad`);
        if (!material.salePrice) errors.push(`Material ${index + 1}: Precio`);
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

    const quotationFolderLocation = "1. Cotización y Order del cliente"

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
      quotationFolderLocation: quotationFolderLocation
    };

    // se añade el id solamente para que en el back se crée correctamente
    if (deliveryAddressSelected?.deliveryContact?.id) {
      dataToSend.deliveryAddress.deliveryContact = deliveryAddressSelected.deliveryContact.id;
    }

    // Prepare files object
    const files = {};
    if (quotationFile) files.quotationFile = quotationFile;
    if (purchaseOrderFile) files.purchaseOrderFile = purchaseOrderFile;

    // Send using the usePostWithFiles hook
    try {
      const result = await createOrderFetchPost("/orders/createOrder", dataToSend, files);
      
      if (result.message === "success") {
        setIsModalOpen(true);
        // Clear fields
        setClientSelected(null);
        setCompanySelected(null);
        setOrderNumGlobal('');
        setQuotNumGlobal('');
        setDatePOClient(getCurrentDate());
        setPOClientNumber('');
        setClientCreditDays('');
        setDeliverInDays(12);
        setDeliveryAddresses('');
        setDeliveryAddressSelected('');
        setOrderTotal(0);
        setOrderTotalPlusTax(0);
        setMaterials([]);
        setQuotationFile(null);
        setPurchaseOrderFile(null);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al crear la orden: ' + error.message);
    }
  };

  useEffect(() => {
    if (clientSelected) {
      classificationsFetchGet('/materials/getClassifications');
      contactsFetchGet(`/contacts/clientContacts/${clientSelected?.id}`);
      brandsFetchGet('/materials/getBrands');
    }
    setCompanySelected("");
  }, [clientSelected]);


  useEffect(() => {
    if(companySelected){
      setDeliveryAddressSelected("");
      setDeliveryAddresses(companySelected?.deliveryAddresses);
    }
  }, [companySelected]);

  useEffect(() => {
    setOrderTotalPlusTax(parseFloat((orderTotal * 1.16).toFixed(2)));
  }, [orderTotal]);

  // Calculate total automatically from materials
    useEffect(() => {
      const calculateTotal = () => {
        const total = materials.reduce((sum, material) => {
          const salePrice = parseFloat(material.salePrice) || 0;
          const quantity = parseFloat(material.quantity) || 0;
          return sum + (salePrice * quantity);
        }, 0);
        
        // Round the final total to 2 decimals
        setOrderTotal(parseFloat(total.toFixed(2)));
      };

      calculateTotal();
    }, [materials]);

  // Handle order creation response
  useEffect(() => {
    if (createOrderPostResponse?.message === "success") {
      setIsModalOpen(true);
      // Clear fields are now handled in the handleCreateOrder function
    }
  }, [createOrderPostResponse]);

  // File upload handlers
  const handleDragEnter = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === 'quotation') {
      setIsDragOverQuotation(true);
    } else {
      setIsDragOverPurchaseOrder(true);
    }
  };

  const handleDragLeave = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === 'quotation') {
      setIsDragOverQuotation(false);
    } else {
      setIsDragOverPurchaseOrder(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (fileType === 'quotation') {
      setIsDragOverQuotation(false);
    } else {
      setIsDragOverPurchaseOrder(false);
    }
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      alert('Solo se puede subir un archivo por sección');
      return;
    }
    
    const file = files[0];
    
    // Check total file size (4.5 MB = 4.5 * 1024 * 1024 bytes)
    const maxTotalSize = 4.5 * 1024 * 1024;
    const existingFileSize = fileType === 'quotation' 
      ? (purchaseOrderFile ? purchaseOrderFile.size : 0)
      : (quotationFile ? quotationFile.size : 0);
    const newTotalSize = file.size + existingFileSize;
    
    if (newTotalSize > maxTotalSize) {
      const totalSizeMB = (newTotalSize / (1024 * 1024)).toFixed(2);
      alert(`El tamaño total de los archivos (${totalSizeMB} MB) excede el límite de 4.5 MB. Por favor, reduce el tamaño de los archivos.`);
      return;
    }
    
    if (fileType === 'quotation') {
      setQuotationFile(file);
      // Automatically extract materials from quotation file
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        extractMaterialsFromExcel(file);
      }
    } else {
      setPurchaseOrderFile(file);
    }
  };

  const handleFileInput = (e, fileType) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      alert('Solo se puede subir un archivo por sección');
      return;
    }
    
    const file = files[0];
    if (!file) return;
    
    // Check total file size (4.5 MB = 4.5 * 1024 * 1024 bytes)
    const maxTotalSize = 4.5 * 1024 * 1024;
    const existingFileSize = fileType === 'quotation' 
      ? (purchaseOrderFile ? purchaseOrderFile.size : 0)
      : (quotationFile ? quotationFile.size : 0);
    const newTotalSize = file.size + existingFileSize;
    
    if (newTotalSize > maxTotalSize) {
      const totalSizeMB = (newTotalSize / (1024 * 1024)).toFixed(2);
      alert(`El tamaño total de los archivos (${totalSizeMB} MB) excede el límite de 4.5 MB. Por favor, reduce el tamaño de los archivos.`);
      // Clear the file input
      e.target.value = '';
      return;
    }
    
    if (fileType === 'quotation') {
      setQuotationFile(file);
      // Automatically extract materials from quotation file
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        extractMaterialsFromExcel(file);
      }
    } else {
      setPurchaseOrderFile(file);
    }
  };

  const removeFile = (fileType) => {
    if (fileType === 'quotation') {
      setQuotationFile(null);
    } else {
      setPurchaseOrderFile(null);
    }
  };

  // Function to extract materials from Excel file
  const extractMaterialsFromExcel = async (file) => {
    setIsExtractingMaterials(true);
    
    try {
      const result = await extractMaterialsXls(file);
      
      if (result.success) {
        if (result.materials.length > 0) {
          setMaterials(result.materials);
          alert(`Se extrajeron ${result.count} materiales de la hoja de cotización`);
        } else {
          alert('No se encontraron materiales en la hoja de cotización');
        }
      } else {
        alert('Error al extraer materiales del archivo Excel. Verifique que el formato sea correcto.');
      }
      
    } catch (error) {
      console.error('Error extracting materials from Excel:', error);
      alert('Error al extraer materiales del archivo Excel. Verifique que el formato sea correcto.');
    } finally {
      setIsExtractingMaterials(false);
    }
  };

  return (
    <>
        <CreatedOrderModal
          isOpen={isModalOpen}
          createOrderPostResponse={createOrderPostResponse}
        />
        
        {/* Loading Spin for Excel Material Extraction */}
        {isExtractingMaterials && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
              <Spin />
              <p className="text-gray-700 font-medium">Extrayendo materiales del archivo Excel...</p>
            </div>
          </div>
        )}
        
      <div className='relative overflow-visible bg-gray-50 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center pb-6'>
            <h1 className='text-3xl font-bold text-indigo-700'>Crear Pedido</h1>
            <Link className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200" to="/orders">
              Ir a Pedidos
            </Link>
          </div>

          {/* Client and Company Selection */}
          <div className='bg-white rounded-xl shadow-md p-4 mb-2'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>Información del Cliente</h2>
            <div className='flex flex-col lg:flex-row lg:justify-between lg:space-x-6 space-y-2 lg:space-y-0'>
              <div className='flex items-center justify-start space-x-3 w-full'>
                <span className='inline-block w-1/3 text-sm font-medium text-gray-700'>Cliente</span>
                <ClientsComboBox
                  className='w-2/3'
                  clients={clientsData?.clients}
                  clientSelected={clientSelected}
                  setClientSelected={setClientSelected}
                />
              </div>

              <div className='flex items-center justify-start space-x-3 w-full'>
                <label className='inline-block w-1/3 text-sm font-medium text-gray-700'>Empresa</label>
                <CompaniesComboBox
                  className='w-2/3'
                  clientSelected={clientSelected}
                  companySelected={companySelected}
                  setCompanySelected={setCompanySelected}
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className='bg-white rounded-xl shadow-md p-4 mb-2'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>Dirección de Entrega</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='flex items-center'>
                <label className='inline-block w-1/3 text-sm font-medium text-gray-700'>Dirección de Entrega</label>
                <DeliveryAddressComboBox
                  className='w-2/3'
                  deliveryAddresses={deliveryAddresses}
                  deliveryAddressSelected={deliveryAddressSelected}
                  setDeliveryAddressSelected={setDeliveryAddressSelected}
                />
              </div>
              <div className='bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 shadow-sm'>
                { deliveryAddressSelected ? (
                  <div className='text-sm space-y-1'>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Contacto:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryContact?.contactName}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Móvil:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryContact?.mobile}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Alias:</span> <span className='text-gray-800'>{deliveryAddressSelected?.aliasDeliveryAddress}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Dirección:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryAddress}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Ciudad:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryCity}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>Estado:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryState}</span></div>
                    <div className='flex justify-between items-center'><span className='font-semibold text-gray-600'>C.P.:</span> <span className='text-gray-800'>{deliveryAddressSelected?.deliveryZipCode}</span></div>
                  </div>
                    
                    ) : 
                (<p className='text-sm text-gray-500 italic text-center py-8'> Selecciona una dirección de entrega </p>)}
              </div>
            </div>
            
            {/* File Upload Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Documentos de Entrega</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hoja Cotización Upload */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Hoja Cotización</h4>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${
                      isDragOverQuotation 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                    onDragEnter={(e) => handleDragEnter(e, 'quotation')}
                    onDragLeave={(e) => handleDragLeave(e, 'quotation')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'quotation')}
                  >
                    <div className="space-y-2">
                      <svg className="mx-auto h-6 w-6 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium text-indigo-600">Arrastra archivo aquí</span> o{' '}
                        <label className="cursor-pointer text-indigo-600 underline hover:text-indigo-700">
                          selecciona archivo
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileInput(e, 'quotation')}
                            accept=".xlsx,.xls,.pdf,.doc,.docx"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Excel (.xlsx, .xls) recomendado para extracción automática</p>
                    </div>
                  </div>
                  
                {/* Quotation File Display */}
                  {quotationFile && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">{quotationFile.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile('quotation')}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Orden de Compra Cliente Upload */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Orden de Compra Cliente</h4>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${
                      isDragOverPurchaseOrder 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                    onDragEnter={(e) => handleDragEnter(e, 'purchaseOrder')}
                    onDragLeave={(e) => handleDragLeave(e, 'purchaseOrder')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'purchaseOrder')}
                  >
                    <div className="space-y-2">
                      <svg className="mx-auto h-6 w-6 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium text-indigo-600">Arrastra archivo aquí</span> o{' '}
                        <label className="cursor-pointer text-indigo-600 underline hover:text-indigo-700">
                          selecciona archivo
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileInput(e, 'purchaseOrder')}
                            accept=".pdf,.doc,.docx,.jpg,.png,.xlsx"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, IMG, XLS</p>
                    </div>
                  </div>
                  
                  {/* Purchase Order File Display */}
                  {purchaseOrderFile && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">{purchaseOrderFile.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile('purchaseOrder')}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Section */}
          <div className='bg-white rounded-xl shadow-md p-4 mb-2'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>Detalles del Pedido</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
              
              {/* Número de cotización */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Cotización GE</label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400'
                  value={quotNumGlobal}
                  placeholder='2145_v2'
                  onChange={(e) => setQuotNumGlobal(e.target.value)}
                />
              </div>

              {/* Fecha de pedido */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Fecha de pedido</label>
                <input
                  type='date'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200'
                  value={datePOClient}
                  onChange={(e) => setDatePOClient(e.target.value)}
                />
              </div>

              {/* Pedido del cliente */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Num Orden Compra de Cliente</label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200'
                  value={pOClientNumber}
                  onChange={(e) => setPOClientNumber(e.target.value)}
                />
              </div>

               {/* Días de entrega */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Días Entrega Promesa</label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200'
                  value={deliverInDays}
                  onChange={(e) => setDeliverInDays(e.target.value)}
                />
              </div>

              {/* Días de crédito */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Días de crédito</label>
                <input
                  type='number'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200'
                  value={clientCreditDays}
                  onChange={(e) => setClientCreditDays(e.target.value)}
                />
              </div>

              {/* Total de la orden */}
              <div className='bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-4 shadow-sm'>
                <h3 className='text-sm font-medium text-gray-700 mb-3'>Resumen de Totales</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-600'>Subtotal:</span>
                    <span className='text-lg font-semibold text-gray-900'>{formatCurrency(orderTotal)}</span>
                  </div>
                  <div className='flex justify-between items-center border-t pt-2'>
                    <span className='text-sm font-medium text-gray-600'>IVA (16%):</span>
                    <span className='text-lg font-semibold text-gray-900'>{formatCurrency(orderTotalPlusTax - orderTotal)}</span>
                  </div>
                  <div className='flex justify-between items-center border-t-2 border-indigo-300 pt-2'>
                    <span className='text-base font-bold text-indigo-800'>Total:</span>
                    <span className='text-xl font-bold text-indigo-800'>{formatCurrency(orderTotalPlusTax)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Materials Section */}
          <div className='bg-white rounded-xl shadow-md p-4 mb-2'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>Materiales del Pedido</h2>
            <MaterialsTable 
              materials={materials} 
              setMaterials={setMaterials} 
              classificationsData={classificationsData}
              brandsData={brandsData}
            />
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold">Por favor completa los siguientes campos:</h3>
                  <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
                
          <div className='flex justify-end'>
             <button
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                onClick={handleCreateOrder}
                disabled={createOrderIsLoading}
              >
                {createOrderIsLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </>
                ) : (
                  'Crear Pedido'
                )}
              </button>
            </div>

        </div>
      </div>
    </>
  );
}

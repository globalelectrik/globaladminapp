import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { EditIcon, PlusCircleIcon } from 'lucide-react';
import useGet from '../../../../hooks/useGet/useGet.jsx';
import usePut from './../../../../hooks/usePut/usePut';
import usePost from '../../../../hooks/usePost/usePost.jsx';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency.js';
import { formatDateToReadable } from '../../../../utils/helpers/formatDateToReadable.js';
import OrderMaterialsTable from '../OrderDetailComponents/Materials/OrderMaterialsTable.jsx';
import EditOrderMaterialRow from '../OrderDetailComponents/Materials/EditOrderMaterialRowModal.jsx';
import AddOrderMaterialModal from '../OrderDetailComponents/Materials/AddOrderMaterialModal.jsx';
import OrderMaterialsPurchasesTable from '../OrderDetailComponents/Purchasing/OrderMaterialsPurchasesTable.jsx';
import CreatePurchaseModal from '../OrderDetailComponents/Purchasing/CreatePurchaseModal.jsx';
import GeneradorAlbaranPDF from '../OrderDetailComponents/GeneradorAlbaranPDF/GeneradorAlbaranPDF.jsx';
import DetailPurchaseRowModal from '../OrderDetailComponents/Purchasing/DetailPurchaseRowModal.jsx';
import ShipmentsTable from '../OrderDetailComponents/Shipments/ShipmentsTable.jsx';
import ShipmentsDeliveryLinkModal from '../OrderDetailComponents/Shipments/ShipmentsDeliveryLinkModal.jsx';
import useGetPdf from '../../../../hooks/useGetPdf/useGetPdf.jsx';
import useGetXml from './../../../../hooks/useGetXml/useGetXml';

export default function OrderDetailView() {
  const { id } = useParams();
  const [orderSelected, setOrderSelected] = useState("")
  const [openEditRowModal, setOpenEditRowModal] = useState(false);
  const [selectedMaterialRow, setSelectedMaterialRow] = useState(null)
  const [editMaterialIndex, setEditMaterialIndex] = useState(null);
  const [openAddMaterialModal, setOpenAddMaterialModal] = useState(false);
  const [openCreatePurchaseModal, setOpenCreatePurchaseModal] = useState(false);
  const [materials, setMaterials] = useState("")
  const [materialSelected, setMaterialSelected] = useState("")
  const [openPuchaseRowModal, setOpenPuchaseRowModal] = useState(false)
  const [selectedPurchaseRow, setSelectedPurchaseRow] = useState(null)
  const [editPuchaseIndex, setEditPurchaseIndex] = useState(null)
  const [openDeliveryLinkModal, setOpenDeliveryLinkModal] = useState(false)
  const [downloadDeliveryLink, setDownloadDeliveryLink] = useState(null)
   
    
  const {
    postResponse: createPurchasePostResponse,
    isLoading: createPurchaseIsLoading,
    error: createPurchaseError,
    fetchPost: createPurchaseFetchPost,
  } = usePost();

// HOOK AVAILABLE AT SHIPMENTS TABLE TO CREATE DELIVERY
// AND MODAL ALBARAN TO REFRESH ORDER AFTER CREATING DELIVERY
  const {
    postResponse: createDeliveryPostResponse,
    isLoading: createDeliveryIsLoading,
    error: createDeliveryError,
    fetchPost: createDeliveryFetchPost,
  } = usePost();

  const { 
    putResponse: orderMaterialUpdatedData,
    isLoading: orderMaterialUpdateIsLoading,
    error: orderMaterialUpdateError,
    fetchPut: orderMaterialUpdateFetchPut,
   } = usePut();

  const { 
    putResponse: orderNewMaterialUpdatedData,
    isLoading: orderNewMaterialUpdateIsLoading,
    error: orderNewMaterialUpdateError,
    fetchPut: orderNewMaterialUpdateFetchPut,
   } = usePut();

  const {
    data: orderData,
    isLoading: orderIsLoading,
    error: orderError,
    fetchGet: orderFetchGet,
  } = useGet();

  const {
    putResponse: orderAddMaterialUpdatedData,
    fetchPut: orderAddMaterialUpdateFetchPut,
  } = usePut();

   const { 
    data: downloadDeliveryLinkData,
    isLoading: downloadDeliveryLinkIsLoading,
    error: downloadDeliveryLinkError,
    fetchGet: downloadDeliveryLinkFetchPut,
   } = useGet();

  const {
    data: pdfData,
    isLoading: pdfIsLoading,
    error: pdfError,
    fetchPdf: fetchGetPdf,
  } = useGetPdf();

  const {
    fetchXml,
    loading: xmlIsLoading,
    error: xmlError,
  } = useGetXml();

// Fetch order details on component mount
  useEffect(() => {
    orderFetchGet(`/orders/orderDetail/${id}`);
  }, []);

// when orderData changes, update orderSelected state
  useEffect(() => {
    if(orderData){
      setOrderSelected(orderData.order)
      setMaterials(orderData.order.materials)
    }
  }, [orderData]);

// Refresh order after creating delivery  
    useEffect(() => {
    if(createDeliveryPostResponse){
      setOrderSelected(createDeliveryPostResponse.order)
    }
  }, [createDeliveryPostResponse]) 

  // When material in order is edited, refresh the order
  useEffect(() => {
    if(orderMaterialUpdatedData){
      setOrderSelected(orderMaterialUpdatedData.order)
    }
  }, [orderMaterialUpdatedData]);

  // When a material is purchased, refresh the order
  useEffect(() => {
    if(createPurchasePostResponse){
      setOrderSelected(createPurchasePostResponse.order)
    }
  }, [createPurchasePostResponse]);

  // When downloadDeliveryLinkData changes, open modal and set link
    useEffect(() => {
    if(downloadDeliveryLinkData?.message === "success"){
      setOpenDeliveryLinkModal(true)
      setDownloadDeliveryLink(downloadDeliveryLinkData.url)
    }
  }, [downloadDeliveryLinkData]);

  // Cuando se añade nuevo material, refresca la order
  useEffect(() => {
    if (orderAddMaterialUpdatedData?.message === "Orden actualizada con éxito") {
      setOrderSelected(orderAddMaterialUpdatedData.order)
      setMaterials(orderAddMaterialUpdatedData.order.materials)
      return alert("Orden actualizada con éxito");
    } if (orderAddMaterialUpdatedData?.message === "Error al actualizar Orden") {
      return alert("Error al actualizar Orden");
    }
  }, [orderAddMaterialUpdatedData]);

// Saves changes made in Edit Material Modal
const saveMaterialOrderChanges = async () => {
  const updatedMaterials = [...orderSelected.materials];
  updatedMaterials[editMaterialIndex] = { ...selectedMaterialRow };

  const updatedOrder = {
    ...orderSelected,
    materials: updatedMaterials,
  };
  setOrderSelected(updatedOrder);
  await orderMaterialUpdateFetchPut(`/orders/updateOrderMaterials/${id}`, updatedOrder); 
  setOpenEditRowModal(false)
};

const downloadInvoice = async (invoiceId) => {
  try {
    await fetchGetPdf(`/facturaCom/getInvoicePdf/${invoiceId}`, `invoice-${invoiceId}.pdf`);
  } catch (error) {
    console.error('PDF download error:', error);
  }
};

const downloadXml = async (invoiceId) => {
  try {
    await fetchXml(`/facturaCom/getInvoiceXml/${invoiceId}`, `invoice-${invoiceId}.xml`);
    console.log('XML download completed');
  } catch (error) {
    console.error('XML download error:', error);
  }
}

  return (
    <div className='relative overflow-visible bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>

        <div className="flex items-center justify-between pb-6">
          <div className='flex gap-2 items-end'>
            <h1 className="text-xl font-bold">Orden: {orderSelected?.orderNumGlobal}</h1>
            <a className="text-indigo-600 underline hover:text-indigo-700 transition-colors duration-200"
              href={orderSelected.sharepointWebURL}
              target="_blank"
              rel="noopener noreferrer"> Ir a Sharepoint</a>
            </div>
            <NavLink className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200" to={'/orders'}> 
              Pedidos 
            </NavLink>
          </div>

        {/* General Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mb-2">
          <section className="bg-white rounded-xl shadow-md p-6 lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Cliente:</span><span className='text-right text-gray-900 font-semibold text-sm'>{orderSelected?.client?.commercialClientName}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Razón Social:</span><span className='text-right text-gray-900 font-semibold text-sm'>{orderSelected?.vatName}</span> </div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Cotización GE #:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.quotNumGlobal}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Orden de Compra:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.pOClientNumber}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Fecha OC:</span> <span className='text-gray-900 font-semibold text-sm'>{formatDateToReadable(orderSelected?.datePOClient)}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">RFC:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.vatNumber}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Días entrega:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.deliverInDays ?? 'N/A'} días</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Día Entregado:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.dateDeliveredToClient ?? 'Pending'}</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-sm text-gray-600">Días Credito:</span> <span className='text-gray-900 font-semibold text-sm'>{orderSelected?.clientCreditDays}</span></div>
            </div>
            
            {/* Totals Section with gradient background */}
            <div className='bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-2 shadow-sm mt-1'>
              <h3 className='text-sm font-medium text-gray-700 mb-1'>Resumen de Totales</h3>
              <div className='space-y-1'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-600'>Total Orden:</span>
                  <span className='text-sm font-semibold text-gray-900'>{formatCurrency(orderSelected?.orderTotal)}</span>
                </div>
                <div className='flex justify-between items-center border-t-2 border-indigo-300 pt-2'>
                  <span className='text-sm font-bold text-indigo-800'>Total +IVA:</span>
                  <span className='text-sm  font-bold text-indigo-800'>{formatCurrency(orderSelected?.orderTotalPlusTax)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Address - takes 2/5 on lg+ screens */}
          <section className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dirección de Entrega</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center"><strong className="text-gray-600">Contacto Entrega:</strong> <span className="text-gray-900 font-medium">{orderSelected?.deliveryAddress?.deliveryContact?.contactName}</span></div>
              <div className="flex justify-between items-center"><strong className="text-gray-600">Alias:</strong> <span className="text-gray-900 font-medium">{orderSelected?.deliveryAddress?.aliasDeliveryAddress}</span></div>
              <div className="flex justify-between items-center"><strong className="text-gray-600">Teléfono:</strong> <span className="text-gray-900 font-medium">{orderSelected?.deliveryAddress?.deliveryContact?.telephone}</span></div>
              <div className="border-t pt-3 mt-3">
                <div className="text-gray-600 font-medium mb-2">Dirección:</div>
                <div className="text-gray-900 space-y-1">
                  <div>{orderSelected?.deliveryAddress?.deliveryAddress}</div>
                  <div>{orderSelected?.deliveryAddress?.deliveryCity}, {orderSelected?.deliveryAddress?.deliveryState}</div>
                  <div>C.P. {orderSelected?.deliveryAddress?.deliveryZipCode}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Materials */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-2">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-lg font-semibold text-gray-800">Materiales Solicitados</h2>
            <button
              className="inline-flex items-center px-2 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setOpenAddMaterialModal(true)}
            >
            <PlusCircleIcon className='h-4 w-4 mr-1' />
              Añadir Material
            </button>
          </div>
          <OrderMaterialsTable
            orderSelected={orderSelected}
            setOrderSelected={setOrderSelected}
            setOpenEditRowModal={setOpenEditRowModal}
            selectedMaterialRow={selectedMaterialRow}
            setSelectedMaterialRow={setSelectedMaterialRow}
            editMaterialIndex={editMaterialIndex}
            setEditMaterialIndex={setEditMaterialIndex}
          />
        </section>

        {/* Purchases */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-2">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-lg font-semibold text-gray-800">Compras Realizadas</h2>
            <button
              className="inline-flex items-center px-2 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => {
                setSelectedMaterialRow(null); // opción: puedes cambiar esto si quieres pasar un material
                setOpenCreatePurchaseModal(true);
              }}
            >
              <PlusCircleIcon className='h-4 w-4 mr-1' />
              Añadir Compra
            </button>
          </div>
          <OrderMaterialsPurchasesTable
            orderSelected={orderSelected}
            setOrderSelected={setOrderSelected}
            setOpenPuchaseRowModal={setOpenPuchaseRowModal}
            selectedMaterialRow={selectedMaterialRow}
            setSelectedPurchaseRow={setSelectedPurchaseRow}
            editPuchaseIndex={editPuchaseIndex}
            setEditPurchaseIndex={setEditPurchaseIndex}
          />
        </section>

        {/* Envíos de Compras*/}
        <section className="bg-white rounded-xl shadow-md mb-2">
          <ShipmentsTable 
            orderSelected={orderSelected}
            setOrderSelected={setOrderSelected}
            openDeliveryLinkModal={openDeliveryLinkModal}
            setOpenDeliveryLinkModal={setOpenDeliveryLinkModal}
            downloadDeliveryLinkFetchPut={downloadDeliveryLinkFetchPut}
            createDeliveryPostResponse={createDeliveryPostResponse}
            createDeliveryIsLoading={createDeliveryIsLoading}
            createDeliveryError={createDeliveryError}
            createDeliveryFetchPost={createDeliveryFetchPost}
            downloadInvoice={downloadInvoice}
            downloadXml={downloadXml}
          />
        </section>         
     
      {/* Incidences */}
      {/* <section className="bg-white p-4 shadow rounded-xl mt-3">
        <h2 className="text-lg font-semibold mb-2">Incidencias</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <strong>Incidencia Proveedor:</strong> {orderSelected?.incidenceSupplier ? 'Yes' : 'No'}
            {orderSelected?.incidenceSupplierCause && <div><strong>Cause:</strong> {orderSelected.incidenceSupplierCause}</div>}
          </div>
          <div>
            <strong>Incidencia GE:</strong> {orderSelected?.incidenceGE ? 'Yes' : 'No'}
            {orderSelected?.incidenceGECause && <div><strong>Cause:</strong> {orderSelected.incidenceGECause}</div>}
          </div>
        </div>
      </section> */}

        {/* Comments */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Comentarios</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <strong className="text-gray-700 text-sm font-medium">Comentarios Privados</strong>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                {orderSelected?.privateComments?.map((comment, i) => (
                  <li key={i}>{comment.privateComment}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <strong className="text-gray-700 text-sm font-medium">Comentarios Públicos</strong>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                {orderSelected?.publicComments?.map((comment, i) => (
                  <li key={i}>{comment.publicComment}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      <EditOrderMaterialRow
        isOpen={openEditRowModal}
        onClose={() => setOpenEditRowModal(false)}
        selectedMaterialRow={selectedMaterialRow}
        setSelectedMaterialRow={setSelectedMaterialRow}
        orderSelected={orderSelected}
        setOrderSelected={setOrderSelected}
        saveMaterialOrderChanges={saveMaterialOrderChanges}
        editMaterialIndex={editMaterialIndex}
      />       

      <DetailPurchaseRowModal
        isOpen={openPuchaseRowModal}
        onClose={() => setOpenPuchaseRowModal(false)}
        selectedPurchaseRow={selectedPurchaseRow}
        setSelectedPurchaseRow={setSelectedPurchaseRow}
        orderSelected={orderSelected}
        setOrderSelected={setOrderSelected}
        editMaterialIndex={editMaterialIndex}
      />       

      <AddOrderMaterialModal
        isOpen={openAddMaterialModal}
        onClose={() => setOpenAddMaterialModal(false)}
        orderSelected={orderSelected}
        setOrderSelected={setOrderSelected}
        orderAddMaterialUpdatedData={orderAddMaterialUpdatedData}
        orderAddMaterialUpdateFetchPut={orderAddMaterialUpdateFetchPut}
      />

      <CreatePurchaseModal
          orderSelected={orderSelected}
          isOpen={openCreatePurchaseModal}
          onClose={() => setOpenCreatePurchaseModal(false)}
          materials={materials}
          materialSelected={materialSelected}
          setMaterialSelected={setMaterialSelected}
          createPurchasePostResponse={createPurchasePostResponse}
          createPurchaseFetchPost={createPurchaseFetchPost}
          orderId={id}
        />

      <ShipmentsDeliveryLinkModal
        openDeliveryLinkModal={openDeliveryLinkModal}
        setOpenDeliveryLinkModal={setOpenDeliveryLinkModal}
        downloadDeliveryLink={downloadDeliveryLink} 
        setDownloadDeliveryLink={setDownloadDeliveryLink}
        
      />

      </div>
    </div>
  );
}

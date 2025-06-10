import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import useGet from '../../../../hooks/useGet/useGet.jsx';
import usePut from './../../../../hooks/usePut/usePut';
import usePost from '../../../../hooks/usePost/usePost.jsx';
import { formatCurrency } from '../../../../helpers/formatCurrency.js';
import { formatDateToReadable } from '../../../../utils/helpers/formatDateToReadable.js';
import OrderMaterialsTable from '../OrderDetailComponents/OrderMaterialsTable.jsx';
import EditOrderMaterialRow from '../OrderDetailComponents/EditOrderMaterialRowModal.jsx';
import AddOrderMaterialModal from '../OrderDetailComponents/AddOrderMaterialModal.jsx';
import OrderMaterialsPurchasesTable from '../OrderDetailComponents/OrderMaterialsPurchasesTable.jsx';
import CreatePurchaseModal from '../OrderDetailComponents/CreatePurchaseModal.jsx';
import DetailPurchaseRowModal from '../OrderDetailComponents/DetailPurchaseRowModal.jsx';

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
   
  
  
  const {
    postResponse: createPurchasePostResponse,
    isLoading: createPurchaseIsLoading,
    error: createPurchaseError,
    fetchPost: createPurchaseFetchPost,
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

  useEffect(() => {
    orderFetchGet(`/orders/orderDetail/${id}`);
  }, []);

  useEffect(() => {
    if(orderData){
      setOrderSelected(orderData.order)
      setMaterials(orderData.order.materials)
    }
  }, [orderData]);

  useEffect(() => {
    if(orderMaterialUpdatedData){
      setOrderSelected(orderMaterialUpdatedData.order)
    }
  }, [orderMaterialUpdatedData]);

  useEffect(() => {
    if(createPurchasePostResponse){
      setOrderSelected(createPurchasePostResponse.order)
    }
  }, [createPurchasePostResponse]);


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



  return (
    <div className="py-4 space-y-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">Orden: {orderSelected?.orderNumGlobal}</h1>
         <NavLink className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600" to={'/orders'}> Pedidos </NavLink>
       
      </div>

      {/* General Info */}
     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <section className="bg-white p-4 shadow rounded-xl space-y-1 md:col-span-3">
        <h2 className="text-lg font-semibold mb-2">Info General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
          <div className="flex justify-between"><span className="font-medium">Cotización GE #:</span> {orderSelected?.quotNumGlobal}</div>
          <div className="flex justify-between"><span className="font-medium">Orden de Compra:</span> {orderSelected?.pOClientNumber}</div>
          <div className="flex justify-between"><span className="font-medium">Fecha OC:</span> {formatDateToReadable(orderSelected?.datePOClient)}</div>
          <div className="flex justify-between"><span className="font-medium">Cliente:</span> {orderSelected?.client?.commercialClientName}</div>
          <div className="flex justify-between"><span className="font-medium">Razón Social:</span> {orderSelected?.vatName}</div>
          <div className="flex justify-between"><span className="font-medium">RFC:</span> {orderSelected?.vatNumber}</div>
          <div className="flex justify-between"><span className="font-medium">Días entrega:</span> {orderSelected?.deliverInDays ?? 'N/A'} días</div>
          <div className="flex justify-between"><span className="font-medium">Día Entregado:</span> {orderSelected?.dateDeliveredToClient ?? 'Pending'}</div>
          <div className="flex justify-between"><span className="font-medium">Días Credito:</span> {orderSelected?.clientCreditDays}</div>
          <div className="flex justify-between"><span className="font-medium">Total Orden:</span> {formatCurrency(orderSelected?.orderTotal)}</div>
          <div className="flex justify-between"><span className="font-medium">Total +IVA:</span> {formatCurrency(orderSelected?.orderTotalPlusTax)}</div>
        </div>
      </section>

      {/* Delivery Address - takes 2/5 on md+ screens */}
      <section className="bg-white p-4 shadow rounded-xl md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Dirección de Entrega</h2>
        <div className="space-y-1 text-sm">
          <div><strong>Alias:</strong> {orderSelected?.deliveryAddress?.aliasDeliveryAddress}</div>
          <div><strong>Teléfono:</strong> {orderSelected?.deliveryAddress?.deliveryContactPhone}</div>
          <div><strong>Dirección:</strong> {orderSelected?.deliveryAddress?.deliveryAddress}</div>
          <div><strong>Ciudad:</strong> {orderSelected?.deliveryAddress?.deliveryCity}</div>
          <div><strong>Estado:</strong> {orderSelected?.deliveryAddress?.deliveryState}</div>
          <div><strong>Código Postal:</strong> {orderSelected?.deliveryAddress?.deliveryZipCode}</div>
        </div>
      </section>
    </div>

      {/* Materials */}
      <section className="bg-white p-4 shadow rounded-xl">
        <div className='flex justify-between'>
          <div>
            <h2 className="text-lg font-semibold mb-4">Materiales</h2>
          </div>
          <div>
            <button
              className="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
              onClick={() => setOpenAddMaterialModal(true)}
            >
              Añadir
            </button>
          </div>
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
      <section className="bg-white p-4 shadow rounded-xl">
        <div className='flex justify-between'>
          <div>
            <h2 className="text-lg font-semibold mb-4">Compras</h2>
          </div>
          <div>
            <button
              className="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
              onClick={() => {
                setSelectedMaterialRow(null); // opción: puedes cambiar esto si quieres pasar un material
                setOpenCreatePurchaseModal(true);
              }}
            >
              Añadir
            </button>
          </div>
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

     
      {/* Incidences */}
      <section className="bg-white p-4 shadow rounded-xl">
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
      </section>

      {/* Invoice */}
      <section className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Factura</h2>
        <div className="space-y-1 text-sm">
          <div><strong>Factura GE #:</strong> {orderSelected?.invoiceNumGE}</div>
          <div><strong>PDF:</strong> {orderSelected?.invoiceNumGEPdf}</div>
          <div><strong>XML:</strong> {orderSelected?.invoiceNumGEXml}</div>
        </div>
      </section>


       {/* Comments */}
      <section className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Comentarios</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <strong>Comentarios Privados</strong>
            <ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
              {orderSelected?.privateComments?.map((comment, i) => (
                <li key={i}>{comment.privateComment}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Comentarios Públicos</strong>
            <ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
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

    </div>
  );
}

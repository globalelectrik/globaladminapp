import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditIcon } from 'lucide-react';
import useGet from '../../../../hooks/useGet/useGet.jsx';
import usePut from './../../../../hooks/usePut/usePut';
import { formatCurrency } from '../../../../helpers/formatCurrency.js';
import { formatDateToReadable } from '../../../../utils/helpers/formatDateToReadable.js';
import OrderMaterialsTable from '../../../../components/Orders/OrderDetail/OrderMaterialsTable.jsx';
import EditOrderMaterialRow from '../../../../components/Orders/OrderDetail/EditOrderMaterialRow.jsx';

export default function OrderDetailView() {
  const { id } = useParams();
  const [orderSelected, setOrderSelected] = useState("")
  const [openEditRowModal, setOpenEditRowModal] = useState(false);
  const [selectedMaterialRow, setSelectedMaterialRow] = useState(null)
  const [editMaterialIndex, setEditMaterialIndex] = useState(null)


  const { 
    putResponse: orderMaterialUpdatedData,
    isLoading: orderMaterialUpdateIsLoading,
    error: orderMaterialUpdateError,
    fetchPut: orderMaterialUpdateFetchPut,
   } = usePut();

  const {
    data: orderData,
    isLoading: orderIsLoading,
    error: orderError,
    fetchGet: orderFetchGet,
  } = useGet();


  useEffect(() => {
    orderFetchGet(`/orders/orderDetail/${id}`);
  }, []);

  useEffect(() => {
    if(orderData){
      setOrderSelected(orderData.order)
    }
  }, [orderData]);

  useEffect(() => {
    if(orderMaterialUpdatedData){
      setOrderSelected(orderMaterialUpdatedData.order)
    }
  }, [orderMaterialUpdatedData]);



  // hacercambios aqui, antes de enviar todo al back se deberá de popular para que se hagan bien los cambios
   const saveMaterialOrderChanges = async () => {
   // con IndexedOrder sabrá el backend qué línea deberá updatear
    const indexedOrder = {
        ...orderSelected, 
          editMaterialIndex: editMaterialIndex
        }

    await orderMaterialUpdateFetchPut(`/orders/updateOrderMaterials/${id}`, indexedOrder);
  };


  return (
    <div className="py-4 space-y-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">Orden: {orderSelected?.orderNumGlobal}</h1>
       
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
        <h2 className="text-lg font-semibold mb-4">Materiales</h2>
        <OrderMaterialsTable
          orderSelected={orderSelected}
          setOrderSelected={setOrderSelected}
          setOpenEditRowModal={setOpenEditRowModal}
          setSelectedMaterialRow={setSelectedMaterialRow}
          editMaterialIndex={editMaterialIndex}
          setEditMaterialIndex={setEditMaterialIndex}
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
        materialData={selectedMaterialRow}
        orderSelected={orderSelected}
        setOrderSelected={setOrderSelected}
        saveMaterialOrderChanges={saveMaterialOrderChanges}
      />       

    </div>
  );
}

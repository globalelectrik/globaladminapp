import { IconContract } from '@tabler/icons-react';
import ModalAlbaran from '../ModalAlbaran/ModalAlbaran';
import { useState } from 'react';
import { generateDeliveryInstrucionsPDF } from '../../../../../utils/generateDeliveryInstructions';
import { PlusCircleIcon } from 'lucide-react';
import ShipmentInfoModal from './ShipmentModal';

export default function ShipmentsTable({
  orderSelected, 
  setOrderSelected, 
  openDeliveryLinkModal, 
  setOpenDeliveryLinkModal, 
  downloadDeliveryLinkFetchPut,
  createDeliveryPostResponse,
  createDeliveryIsLoading,
  createDeliveryError,
  createDeliveryFetchPost,
  downloadInvoice, 
  downloadXml,
  openShipmentInfoModal,
  setOpenShipmentInfoModal,
  orderShipmentInfoFetchPut,
  selectedDeliveryId,
  setSelectedDeliveryId
}) {

  const [openShipModal, setOpenShipModal] = useState(false);
  

  const createLinkButtonHandler = (deliveryId) => {
    downloadDeliveryLinkFetchPut(`/deliveries/deliveryNoteLink/${deliveryId}`)
  }


  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mt-2 ">

     <ModalAlbaran 
          orderSelected={orderSelected} 
          setOrderSelected={setOrderSelected}
          openShipModal={openShipModal} 
          setOpenShipModal={setOpenShipModal}
          createDeliveryPostResponse={createDeliveryPostResponse}
          createDeliveryIsLoading={createDeliveryIsLoading}
          createDeliveryError={createDeliveryError}
          createDeliveryFetchPost={createDeliveryFetchPost}
      />

      <ShipmentInfoModal
          openShipmentInfoModal={openShipmentInfoModal} 
          setOpenShipmentInfoModal={setOpenShipmentInfoModal}
          orderShipmentInfoFetchPut={orderShipmentInfoFetchPut}
          orderSelected={orderSelected}
          selectedDeliveryId={selectedDeliveryId}
      />

      <div className='flex justify-between items-center p-6'>
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Envíos de Compras</h2>
          <button 
            onClick={() => generateDeliveryInstrucionsPDF(orderSelected)}
            className="text-indigo-600 underline hover:text-indigo-700 transition-colors duration-200 text-sm font-medium"
          >
            Instrucciones Entrega
          </button>
        </div>
        <button 
          onClick={() => setOpenShipModal(true)}
          className="inline-flex items-center px-2 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200">
          <PlusCircleIcon className='h-4 w-4 mr-1' />
          Añadir Envío
        </button>
      </div>
      
      <div className="px-6 pb-6 overflow-auto">
        <table className="min-w-full table-auto bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700">
          <tr>
            <th className="px-6 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">Paquetería</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Guía</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Albarán Creado</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Albarán</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Factura Num</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Factura PDF</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider">Factura XML</th>
            <th className="px-6 py-1 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-lg">Estatus Entrega</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orderSelected?.deliveries?.map((del, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-2 py-1 text-sm text-gray-900 font-medium">
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedDeliveryId(del.id);
                    setOpenShipmentInfoModal(true);
                  }} 
                  className="inline-flex items-center py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  {del?.deliveryType || 'Actualizar'}
                </button>
              </td>
              <td className="py-1 text-sm text-gray-900 text-center font-medium">{del?.trackingNumber}</td>
              <td className="py-1 text-sm text-gray-900 text-center">{del?.createdAt.slice(0, 10)}</td>
              <td className="py-1 text-center">
                <button type="button" onClick={()=>createLinkButtonHandler(del.id)} className="inline-flex items-center py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                   Albarán {del.deliveryNoteNumber}
                </button>
              </td>
              <td className="py-1 text-sm text-gray-900 text-center font-medium">F-{del?.invoice?.invoiceNumGE}</td>
              <td className="py-1 text-center">
                <button type="button" onClick={() => downloadInvoice(del?.invoice?.invoiceNumGEPdf)} className="inline-flex items-center py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                   PDF
                </button>
              </td>
              <td className="py-1 text-center">
                <button type="button" onClick={()=>downloadXml(del?.invoice?.invoiceNumGEXml)} className="inline-flex items-center py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                  XML
                </button>
              </td>
              <td className="py-1 text-sm text-gray-900 text-center font-medium">{del?.deliveryStatus}</td>
            </tr> 
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

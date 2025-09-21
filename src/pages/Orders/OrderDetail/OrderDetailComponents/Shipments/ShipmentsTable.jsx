import { IconContract } from '@tabler/icons-react';
import ModalAlbaran from '../ModalAlbaran/ModalAlbaran';
import { useState } from 'react';
import { generateDeliveryInstrucionsPDF } from '../../../../../utils/generateDeliveryInstructions';

export default function ShipmentsTable({orderSelected, setOrderSelected, openDeliveryLinkModal, setOpenDeliveryLinkModal, downloadDeliveryLinkFetchPut}) {

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
      />

      <div className='flex justify-between pt-4 px-4 rounded-xl'>
        <div className='flex'>
          <h2 className='text-lg font-semibold'>Envíos de Compras</h2>
          <button 
            onClick={() => generateDeliveryInstrucionsPDF(orderSelected)}
            className="px-4 py-1 text-indigo-600 underline"
          >
            Instrucciones Entrega
          </button>
        </div>
        <div>
          
          <button 
            onClick={() => setOpenShipModal(true)}
            className="rounded bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
          >
            Añadir
          </button>
        </div>
      </div>
      
      <div className="px-4 sm:p-4">
        <table className="min-w-full table-auto border rounded-md overflow-hidden text-sm">
        <thead className="bg-indigo-600 text-center text-slate-50">
          <tr>
            <th className="px-4 py-1 border-b font-medium text-left">Paquetería</th>
            <th className="px-4 py-1 border-b font-medium">Albarán Creado</th>
            <th className="px-4 py-1 border-b font-medium">Albarán</th>
          </tr>
        </thead>
        <tbody>
          {orderSelected?.deliveries?.map((del, index) => (
            <tr key={index} className="hover:bg-gray-200 cursor-pointer">
              <td className="px-4 py-2 border-b text-left" >{del?.deliveryType}</td>
              <td className="px-4 py-2 border-b text-center" >{del?.createdAt}</td>
              <td className="px-4 py-2 border-b text-indigo-600 underline text-center">
                <button type="button" onClick={()=>createLinkButtonHandler(del.id)} className="rounded-full px-2.5 py-1 text-sm font-semibold text-indigo-600 underline shadow-sm hover:bg-indigo-400 hover:text-white">
                  Albarán
                </button>
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

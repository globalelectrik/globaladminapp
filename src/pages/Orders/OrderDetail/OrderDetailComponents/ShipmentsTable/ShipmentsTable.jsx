import { IconContract } from '@tabler/icons-react';
import ModalAlbaran from '../ModalAlbaran/ModalAlbaran';

export default function ShipmentsTable({orderSelected}) {

  console.log("data",orderSelected);


  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-3">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className='flex justify-normal items-center '>
        <IconContract className="h-6 w-6 text-gray-500 inline-block mr-2" />
        <h3 className="text-lg font-medium leading-6 text-gray-900">Envíos</h3>
        </div>
        <div className='sm:flex hidden'>
        <ModalAlbaran orderSelected={orderSelected} />
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
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
              <td className="px-4 py-2 border-b text-indigo-600 underline text-center"><a target="_blank" href={del?.sharepointWebURL}>Albarán</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>


      <div className="px-4 py-4 sm:px-6 sm:hidden flex">
        {/* Footer or additional actions can go here */}
        <ModalAlbaran orderSelected={orderSelected} />
      </div>

      
    </div>
  )
}

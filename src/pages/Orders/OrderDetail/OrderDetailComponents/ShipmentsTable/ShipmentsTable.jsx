import { IconContract } from '@tabler/icons-react';
import ModalAlbaran from '../ModalAlbaran/ModalAlbaran';

export default function ShipmentsTable({data}) {

  console.log("data",data);

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-3">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className='flex justify-normal items-center '>
        <IconContract className="h-6 w-6 text-gray-500 inline-block mr-2" />
        <h3 className="text-lg font-medium leading-6 text-gray-900">Envíos</h3>
        </div>
        <div className='sm:flex hidden'>
        <ModalAlbaran data={data} />
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">


      </div>


      <div className="px-4 py-4 sm:px-6 sm:hidden flex">
        {/* Footer or additional actions can go here */}
        <ModalAlbaran data={data} />
      </div>
    </div>
  )
}

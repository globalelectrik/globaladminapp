
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon , LinkIcon} from '@heroicons/react/24/outline'
import Spin from '../../../../../components/Spin/Spin'
import { IconContract } from '@tabler/icons-react'
import { useForm, useFieldArray } from 'react-hook-form';
import { getCurrentDate } from '../../../../../utils/helpers/getCurrentDate'


export default function ShipmentInfoModal({ openShipmentInfoModal, setOpenShipmentInfoModal, orderShipmentInfoFetchPut, orderSelected, selectedDeliveryId}) {
  
    const {
      register,
      control,
      handleSubmit,
      reset,
      setValue,              
      formState: { errors },
    } = useForm({
      defaultValues: {
        date: getCurrentDate(),
        deliveryType: '',
        trackingNumber: '',
        shippingCost: 0, 
        orderId: orderSelected.id
      },
    });

  const onSubmit = (data) => {
    console.log('Shipment data:', data);
    // Send both orderId and deliveryId
    orderShipmentInfoFetchPut(`/orders/${orderSelected.id}/delivery/${selectedDeliveryId}`, data);
    setOpenShipmentInfoModal(false);
    reset();
  };

  return (
    <div>
      <Dialog open={openShipmentInfoModal} onClose={setOpenShipmentInfoModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900/50"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800 dark:outline dark:outline-1 dark:-outline-offset-1 dark:outline-white/10"
            >   
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex mb-3'>
                  <IconContract className="h-6 w-6 text-gray-500 inline-block mr-2" />               
                  <h2>Registra el envío</h2>
                </div>
                <div>
                  <label>Fecha de envío</label>
                  <input
                        id="date"
                        {...register('date')}
                        type="date"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label htmlFor="deliveryType" className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                    Selecciona la paquetería
                  </label>
                  <select
                    id="deliveryType"
                    {...register('deliveryType', { required: 'La paquetería es requerida' })}
                    className='mt-1 w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-800 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-800'
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Estafeta">Estafeta</option>
                    <option value="UPS">UPS</option>
                    <option value="En Persona">En Persona</option>
                    <option value="Otra">Otra</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                  {errors.deliveryType && <p className="text-red-600 text-xs mt-1">{errors.deliveryType.message}</p>}
                </div>
                <div>
                  <label htmlFor="trackingNumber" className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                    Número de guía
                  </label>
                  <input
                    id="trackingNumber"
                    {...register('trackingNumber')}
                    type="text"
                    placeholder='Ingresa el número de guía'
                    className='mt-1 w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-800 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-800' 
                  />
                  {errors.trackingNumber && <p className="text-red-600 text-xs mt-1">{errors.trackingNumber.message}</p>}
                </div>
                <div>
                  <label htmlFor="shippingCost" className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                    Coste del Envío
                  </label>
                  <input
                    id="shippingCost"
                    {...register('shippingCost', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'El costo debe ser mayor o igual a 0' }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className='mt-1 w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-800 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-800'
                  />
                  {errors.shippingCost && <p className="text-red-600 text-xs mt-1">{errors.shippingCost.message}</p>}
                </div>
                <div className='mt-6 sm:flex sm:flex-row-reverse sm:gap-3'> 
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                  >
                    Registrar Envío
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenShipmentInfoModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancelar
                  </button>
                </div>
              </form>


            </DialogPanel>

            
          </div>
        </div>
      </Dialog>
    </div>
  )
}
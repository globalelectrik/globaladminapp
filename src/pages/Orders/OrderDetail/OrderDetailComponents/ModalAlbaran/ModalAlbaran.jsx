import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { IconContract, IconPlus } from '@tabler/icons-react'

export default function ModalAlbaran({data}) {
  const [open, setOpen] = useState(false)

  console.log('ENTRO DESDE MODAL',data)

  return (
    <>
    <button
      onClick={() => setOpen(true)} 
      className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <IconPlus className="h-5 w-5 text-white" />
        Crear albarán</button>
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform  overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-6xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <DialogTitle className="text-lg font-medium leading-6 text-gray-900 mb-4">
              <IconContract className="h-6 w-6 text-gray-500 inline-block mr-2" />
              Crear un nuevo albarán
            </DialogTitle>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Numero de albaran */}
            <div>
              <label htmlFor="numeroAlbaran" className="block text-sm/6 font-medium text-zinc-900">
                Número de albarán
              </label>
              <div className="mt-2">
                <input
                  id="numeroAlbaran"
                  name="numeroAlbaran"
                  type="text"
                  placeholder="Ej: 1234567890"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
              </div>
            </div>
            {/* Pedido del cliente */}
            <div>
              <label htmlFor="pedidoCliente" className="block text-sm/6 font-medium text-zinc-900">
                Pedido del cliente
              </label>
              <div className="mt-2">
                <input
                  id="pedidoCliente"
                  name="pedidoCliente"
                  type="text"
                  placeholder="Ej: OC-ING-8371"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900  outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {/* Pedido global */}
            <div>
              <label htmlFor="pedidoGlobal" className="block text-sm/6 font-medium text-zinc-900">
                Pedido global
              </label>
              <div className="mt-2">
                <input
                  id="pedidoGlobal"
                  name="pedidoGlobal"
                  type="text"
                  placeholder="Ej: 250047"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {/* Fecha */}
            <div>
              <label htmlFor="fecha" className="block text-sm/6 font-medium text-zinc-900">
                Fecha
              </label>
              <div className="mt-2">
                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            </div>
            <div>
              {/* Materiales, es necesario que esten en una tabla con un checkbox a la izquierda con el campo de ref editable y con el campo de cantidad editable */}
              <div className="mt-6">
                <table className="min-w-full divide-y divide-zinc-200 border rounded-md">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"></th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Referencia</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Serial</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {/* Aquí se mapea el array de artículos */}
                    {data?.materials?.map((element) => (
                      <tr key={element.id}>
                        <td className="px-2 py-1">
                          <input type="checkbox" className="h-4 w-4 text-indigo-600 border-zinc-300 rounded" />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            defaultValue={element?.material?.materialClientReference}
                            className="w-24 rounded-md border-zinc-300 px-2 py-1 text-sm text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-indigo-600"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <span className="text-sm text-zinc-900">{element?.material?.materialName}</span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="1"
                            defaultValue={element?.quantity}
                            className="w-16 rounded-md border-zinc-300 px-2 py-1 text-sm text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-indigo-600"
                          /> 
                          <span className="text-sm text-zinc-900 ml-2">de {element?.quantity}</span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            defaultValue={element?.material?.serial}
                            className="w-28 rounded-md border-zinc-300 px-2 py-1 text-sm text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-indigo-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              >
                Crear
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
  )
}

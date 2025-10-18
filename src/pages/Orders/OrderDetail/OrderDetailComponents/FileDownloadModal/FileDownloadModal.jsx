
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon , LinkIcon} from '@heroicons/react/24/outline'
import Spin from '../../../../../components/Spin/Spin'



export default function FileDownloadModal({ openFileLinkModal, setOpenFileLinkModal, downloadFileLink, setDownloadFileLink }) {
  

  return (
    <div>
      <Dialog open={openFileLinkModal} onClose={setOpenFileLinkModal} className="relative z-10">
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
              
              <div>
                <div>               
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                    <CheckIcon aria-hidden="true" className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                      Enlace Generado
                    </DialogTitle>
                    <div className="mt-2">
                      <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Descarga el archivo dando click en el botón "Descargar Archivo"
                      </p>
                      <div className="mt-2">
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enlace: {downloadFileLink}
                      </p>
                      {downloadFileLink ? (<LinkIcon
                        onClick={() => {
                          if (downloadFileLink) {
                            navigator.clipboard.writeText(downloadFileLink);
                            alert("Enlace copiado al portapapeles ✅");
                          }
                        }}
                        className="ml-2 inline h-5 w-5 cursor-pointer text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                      />) : (<></>)}
                    </div>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <a
                    href={downloadFileLink}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setOpenFileLinkModal(false)}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                  >
                    Descargar Archivo
                  </a>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => {
                      setOpenFileLinkModal(false); 
                      setDownloadFileLink(null)}
                      }
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20"
                  >
                    Cerrar
                  </button>
                </div>
             </div>


            </DialogPanel>

            
          </div>
        </div>
      </Dialog>
    </div>
  )
}
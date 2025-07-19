
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { IconContract, IconPlus } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

import { generarPDF } from '../../../../../utils/generadorPDF';
import { useAuthContext } from '../../../../../context/AuthContext';
import usePost from '../../../../../hooks/usePost/usePost';

export default function ModalAlbaran({ data }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();

  console.log("data--->>>", data);

  const {
    postResponse: createDeliveryPostResponse,
    isLoading: createDeliveryIsLoading,
    error: createDeliveryError,
    fetchPost: createDeliveryFetchPost,
  } = usePost();

  // Construir el esquema de Zod para el formulario
  const schema = z.object({
    // numeroAlbaran: z.string().nonempty('El número de albarán es obligatorio'),
    date: z.string().nonempty('La date es obligatoria'),
    materials: z.array(
      z.object({
        checked: z.boolean(),
        materialClientReference: z.string(),
        quantity: z.coerce.number(),
        materialSerialNumber: z.string().optional(),
      }).superRefine((val, ctx) => {
        // Obtener el índice del material en el array
        const index = ctx.path[0];
        // Obtener la cantidad máxima permitida desde data.materials
        const maxQty = Array.isArray(data?.materials) && data.materials[index]?.quantity ? data.materials[index].quantity : undefined;
        if (val.checked) {
          if (!val.materialClientReference || val.materialClientReference.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'La referencia es obligatoria',
              path: ['materialClientReference'],
            });
          }
          if (!val.quantity || val.quantity < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Cantidad mínima 1',
              path: ['quantity'],
            });
          }
          if (maxQty !== undefined && val.quantity > maxQty) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `No puede ser mayor que ${maxQty}`,
              path: ['quantity'],
            });
          }
        }
      })
    ),
  });

  // Preparar los valores iniciales para los materiales
  const defaultMaterials = data?.materials?.map((element) => ({
    checked: false,
    materialClientReference: element?.material?.materialClientReference || '',
    quantity: element?.quantity || 1,
    materialSerialNumber: element?.material?.materialSerialNumber || '',
  })) || [];


  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: '',
      materials: defaultMaterials,
    },
  });

  // Resetear el formulario cada vez que se abre el modal
  useEffect(() => {
    if (open) {
      reset({
        date: '',
        materials: defaultMaterials,
      });
    }
  }, [open]);

  const { fields } = useFieldArray({
    control,
    name: 'materials',
  });


  const onSubmit = async (values) => {
    // Filtrar solo los materiales marcados
    const materialesMarcados = values.materials
      .map((mat, idx) => ({
        ...mat,
        _originalIdx: idx,
      }))
      .filter((mat) => mat.checked);

    if (materialesMarcados.length === 0) {
      alert('Debes seleccionar al menos un material para generar el albarán.');
      return;
    }

    // Cliente

    const client = {
      vatName: data.vatName || '',
      vatNumber: data.vatNumber || '',
      aliasDeliveryAddress: data.deliveryAddress.aliasDeliveryAddress || '',
      deliveryContactPhone: data.deliveryAddress.deliveryContactPhone || '',
      deliveryAddress: data.deliveryAddress.deliveryAddress || '',
      deliveryCity: data.deliveryAddress.deliveryCity || '',
      deliveryState: data.deliveryAddress.deliveryState || '',
      deliveryZipCode: data.deliveryAddress.deliveryZipCode || '',
      orderNumGlobal: data.orderNumGlobal || '',
      pOClientNumber: data.pOClientNumber || '',
    };

    // Fecha formateada
    const formattedDate = values.date || new Date().toLocaleDateString();

    // Artículos para el PDF
    const materials = materialesMarcados.map((mat) => {
      const original = data?.materials?.[mat._originalIdx];
      return {
        materialId: original?.material?.id || '',
        materialClientReference: mat.materialClientReference,
        materialName: original?.material?.materialName || '',
        quantityDelivered: mat.quantity,
        materialSerialNumber: mat?.materialSerialNumber || '',
        revision: 'OK',
        firma: user?.name || user?.email || 'Usuario',
      };
    });


    const deliveryData= {
      orderId: data.id,
      client: client, 
      formattedDate: formattedDate, 
      materials: materials,
      pOClientNumber : data.pOClientNumber,
      orderNumGlobal : data.orderNumGlobal,

    }

    console.log("deliveryData --->> ", deliveryData);

    await createDeliveryFetchPost("/orders/deliveries/create", deliveryData)

    generarPDF({
      client,
      formattedDate,
      materials,
    });

    setOpen(false);
    };

  console.log("createDeliveryPostResponse--> ", createDeliveryPostResponse);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <IconPlus className="h-5 w-5 text-white" />
        Crear albarán
      </button>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {/* Fecha */}
                  <div>
                    <label htmlFor="date" className="block text-sm/6 font-medium text-zinc-900">
                      Fecha
                    </label>
                    <div className="mt-2">
                      <input
                        id="date"
                        {...register('date')}
                        type="date"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 placeholder:text-zinc-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
                    </div>
                  </div>
                </div>
                <div>
                  {/* Materiales, tabla con react-hook-form, scroll horizontal y vertical en móvil, columnas más compactas */}
                  <div className="mt-3 overflow-x-auto" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    <label className="block text-sm/6 font-medium text-zinc-900">
                      Materiales comprados:
                    </label>
                    <table className="min-w-[500px] w-full divide-y divide-zinc-200 border rounded-md mt-2">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-1 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-6"></th>
                          <th className="px-1 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-20">Referencia Cliente</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider w-32">Descripción</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider w-32">Referencia Producto</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider w-20">Cantidad</th>
                          <th className="px-1 py-2 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">Seriales</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-zinc-200">
                        {fields.map((field, index) => (
                          <tr key={field.id}>
                            <td className="px-1 py-1">
                              <input
                                type="checkbox"
                                {...register(`materials.${index}.checked`)}
                                className="h-4 w-4 text-indigo-600 border-zinc-300 rounded"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="text"
                                {...register(`materials.${index}.materialClientReference`)}
                                className="w-20 rounded-md border-zinc-300 px-1 py-1 text-xs text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-indigo-600"
                              />
                              {errors.materials?.[index]?.materialClientReference && (
                                <p className="text-xs text-red-600">{errors.materials[index].materialClientReference.message}</p>
                              )}
                            </td>
                            <td className="px-1 py-1 text-center">
                              <span className="text-xs text-zinc-900">{data?.materials?.[index]?.material?.materialName}</span>
                            </td>
                            <td className="px-1 py-1 text-center">
                              <span className="text-xs text-zinc-900">{data?.materials?.[index]?.material?.materialReference}</span>
                            </td>
                           <td className="px-1 py-1 text-center align-middle">
                            <div className="flex flex-col items-center justify-center w-full whitespace-nowrap">
                              <div className="flex flex-row items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  max={data?.materials?.[index]?.quantity || undefined}
                                  {...register(`materials.${index}.quantity`, { valueAsNumber: true })}
                                  className="w-14 min-w-0 rounded-md text-center border border-zinc-300 px-1 py-1 text-xs text-zinc-900 focus:outline-indigo-600"
                                />
                                <span className="text-xs text-zinc-900">
                                  de {data?.materials?.[index]?.quantity}
                                </span>
                              </div>
                              {errors.materials?.[index]?.quantity && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors.materials[index].quantity.message}
                                </p>
                              )}
                            </div>
                          </td>

                            <td className="px-1 py-1 text-center">
                              <input
                                type="text"
                                {...register(`materials.${index}.materialSerialNumber`)}
                                className="w-20 rounded-md border-zinc-300 px-1 py-1 text-xs text-zinc-900 outline-1 -outline-offset-1 outline-zinc-300 focus:outline-indigo-600"
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
                    type="submit"
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
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

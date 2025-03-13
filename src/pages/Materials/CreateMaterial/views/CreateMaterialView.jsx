import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import usePost from './../../../../hooks/usePost/usePost';
import useGet from '../../../../hooks/useGet/useGet';
import { useAuthContext } from '../../../../context/AuthContext';
import ClassificationsComboBox from '../../../../components/CreateMaterials/ClassificationsComboBox/ClassificationsComboBox';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import BrandsComboBox from '../../../../components/CreateMaterials/BrandsComboBox/BrandsComboBox';


export default function CreateMaterialView() {

const [classificationSelected, setClassificationSelected] = useState(null);
const [brandSelected, setBrandSelected] = useState(null);

const { user } = useAuthContext();

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({});

   const {
     data: classificationsData,
     isLoading: classificationsIsLoading,
     error: classificationsError,
     fetchGet: classificationsFetchGet,
   } = useGet();

      const {
     data: brandsData,
     isLoading: brandsIsLoading,
     error: brandsError,
     fetchGet: brandsFetchGet,
   } = useGet();

const {
  postResponse: createMaterialPostReponse,
  isLoading: createMaterialIsLoading,
  error: createMaterialError,
  fetchPost: createMaterialFetchPost,
} = usePost();

const {
  postResponse: createClassificationPostReponse,
  isLoading: createClassificationIsLoading,
  error: createClassificationError,
  fetchPost: createClassificationFetchPost,
} = usePost();

  useEffect(() => {
    classificationsFetchGet('/materials/getClassifications');
    brandsFetchGet('/materials/getBrands');
  }, []);


 const onSubmit = async (values) => {
   values.classification = classificationSelected.classificationName;
   await createMaterialFetchPost('/createMaterial', values);
 };

 const createClassification = async (values) => {
   await createClassificationFetchPost('/createClassification', values);
 }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='rounded-lg bg-white pb-60 shadow'>
        <div className='grid px-4 py-5 sm:p-6'>
          <div className='gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-3 sm:grid-rows-1'>
              <div className='sm:col-start-1 sm:col-end-3 lg:col-start-1 lg:col-end-2'>
                <div className='col-span-full'>
                  <label
                    htmlFor='street-address'
                    className='block text-lg font-medium leading-6 text-indigo-600'>
                    Añadir Nuevo Material
                  </label>
                </div>
              </div>
              <div className='sm:col-start-1 sm:col-end-3 lg:col-start-1 lg:col-end-2'>
                <div className='col-span-full'>
                  <label
                    htmlFor='street-address'
                    className='block text-sm font-medium leading-6 text-gray-900'>
                    Nombre Material
                  </label>
                  <div className='mt-2'>
                    <input
                      {...register('materialName')}
                      name='materialName'
                      id='materialName'
                      autoComplete='street-address'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 placeholder-slate-300 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-800 sm:max-w-xs sm:leading-6'
                      placeholder='Servomotor 240V'
                    />
                  </div>
                </div>
              </div>
              <div className='sm:col-start-1 sm:col-end-3 lg:col-start-1 lg:col-end-2'>
                <div className='col-span-full'>
                  <label
                    htmlFor='street-address'
                    className='block text-sm font-medium leading-6 text-gray-900'>
                    Marca
                  </label>
                  <BrandsComboBox
                    className='w-2/3'
                    brandsData={brandsData}
                    brandSelected={brandSelected}
                    setBrandSelected={setBrandSelected}
                  />
                </div>
              </div>             
              <div className='sm:col-start-1 sm:col-end-3 lg:col-start-1 lg:col-end-2'>
                <div className='col-span-full'>
                  <label
                    htmlFor='street-address'
                    className='block text-sm font-medium leading-6 text-gray-900'>
                    Clasificación
                  </label>
                  <ClassificationsComboBox
                    className='w-2/3'
                    classificationsData={classificationsData}
                    classificationSelected={classificationSelected}
                    setClassificationSelected={setClassificationSelected}
                  />
                </div>
              </div>
              <div className='sm:col-start-1 sm:col-end-3 lg:col-start-1 lg:col-end-2'>
                <div className='col-span-full'>
                  <button
                    onClick={() => handleSubmit(onSubmit)}
                    className='inline-flex items-center gap-x-1.5 rounded-md bg-indigo-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800'>
                    <CheckCircleIcon className='-ml-0.5 h-5 w-5' aria-hidden='true' />
                    Crear Material
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}


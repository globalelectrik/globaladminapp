import React from 'react';
import useGet from '../../../../hooks/useGet/useGet';
import usePost from '../../../../hooks/usePost/usePost';
import usePut from './../../../../hooks/usePut/usePut';
import { useState } from 'react';

export default function ConfigurationsListView() {
  const [newClassification, setNewClassification] = useState('');
  const [newBrand, setNewBrand] = useState('');

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
    postResponse: createClassificationPostReponse,
    isLoading: createClassificationIsLoading,
    error: createClassificationError,
    fetchPost: createClassificationFetchPost,
  } = usePost();

  const {
    postResponse: createBrandPostReponse,
    isLoading: createBrandIsLoading,
    error: createBrandError,
    fetchPost: createBrandFetchPost,
  } = usePost();

  const getClassificationsHandler = async () => {
    classificationsFetchGet('/classifications/getMaterialClassifications');
  };

  const getBrandsHandler = async () => {
    brandsFetchGet('/brands/getBrands');
  };

  const createClassificationHandler = async () => {
    if (newClassification !== "") {
      createClassificationFetchPost('/classifications/createMaterialClassification', {classificationName: newClassification});
      setNewClassification(''); // Clear input
    }
  };

  const createBrandHandler = async () => {
    if (newBrand !== '') {
      createBrandFetchPost('/brands/createMaterialBrand', { brandName: newBrand});
      setNewBrand(''); // Clear input
    }
  };

  return (
    <>
      <div className='mb-4 rounded border p-4'>
        <h2 className='text-md mb-2 font-semibold'>Clasificaciones</h2>

        <div>
          <button
            onClick={getClassificationsHandler}
            className='mr-2 rounded bg-blue-500 px-2 py-2 text-sm text-white hover:bg-blue-600'>
            Ver Clasificaciones
          </button>

          <button
            onClick={createClassificationHandler}
            className='mr-2 rounded bg-green-500 px-2 py-2 text-sm text-white hover:bg-green-600'>
            Crear Clasificación
          </button>

          {classificationsError && <p className='text-red-500'>{classificationsError.message}</p>}
          {createClassificationError && (<p className='text-red-500'>{createClassificationError.message}</p>)}

        </div>

        <ul className='mt-1'>
          {classificationsData?.classifications.map((classification) => (
            <li key={classification.id}>{classification.classificationName}</li>
          ))}
        </ul>

        <div className='mt-1'>
          <input
            type='text'
            value={newClassification}
            onChange={(e) => setNewClassification(e.target.value)}
            placeholder='Nueva Clasificación'
            className='text-sm w-full rounded border p-2'
          />
        </div>
      </div>



      <div className='rounded border p-4'>
        <h2 className='text-md mb-2 font-semibold'>Marcas</h2>
        <div>
          <button
            onClick={getBrandsHandler}
            className='mr-2 rounded bg-blue-500 px-2 py-2 text-sm text-white hover:bg-blue-600'>
            Ver Marcas
          </button>

          <button
            onClick={createBrandHandler}
            className='mr-2 rounded bg-green-500 px-2 py-2 text-sm text-white hover:bg-green-600'>
            Crear Marcas
          </button>

          {brandsError && <p className='text-red-500'>{brandsError.message}</p>}
          {createClassificationError && (<p className='text-red-500'>{createClassificationError.message}</p>)}

        </div>

        <ul className='mt-1'>
          {brandsData?.Brands.map((classification) => (
            <li key={classification.id}>{classification.classificationName}</li>
          ))}
        </ul>

        <div className='mt-1'>
          <input
            type='text'
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder='Nueva Clasificación'
            className='text-sm w-full rounded border p-2'
          />
        </div>
      </div>
    </>
  );
}
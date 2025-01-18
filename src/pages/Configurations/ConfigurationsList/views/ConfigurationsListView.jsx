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
    classificationsFetchGet('/classifications/getClassifications');
  };

  const getBrandsHandler = async () => {
    brandsFetchGet('/brands/getBrands');
  };

  const createClassificationHandler = async () => {
    if (newClassification.trim()) {
      createClassificationFetchPost('/classifications/create', { name: newClassification });
      setNewClassification(''); // Clear input
    }
  };

  const createBrandHandler = async () => {
    if (newBrand.trim()) {
      createBrandFetchPost('/brands/create', { name: newBrand });
      setNewBrand(''); // Clear input
    }
  };

  return (
    <>
      <div className='mb-4 rounded border p-4'>
        <h2 className='mb-2 text-lg font-semibold'>Classifications</h2>
        <button
          onClick={getClassificationsHandler}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          {classificationsIsLoading ? 'Loading...' : 'Get Classifications'}
        </button>
        {classificationsError && <p className='text-red-500'>{classificationsError.message}</p>}
        <ul className='mt-4'>
          {classificationsData?.map((classification) => (
            <li key={classification.id}>{classification.name}</li>
          ))}
        </ul>
        <div className='mt-4'>
          <input
            type='text'
            value={newClassification}
            onChange={(e) => setNewClassification(e.target.value)}
            placeholder='New Classification'
            className='w-full rounded border p-2'
          />
          <button
            onClick={createClassificationHandler}
            className='mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
            {createClassificationIsLoading ? 'Creating...' : 'Create Classification'}
          </button>
          {createClassificationError && (
            <p className='text-red-500'>{createClassificationError.message}</p>
          )}
        </div>
      </div>

      <div className='rounded border p-4'>
        <h2 className='mb-2 text-lg font-semibold'>Brands</h2>
        <button
          onClick={getBrandsHandler}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          {brandsIsLoading ? 'Loading...' : 'Get Brands'}
        </button>
        {brandsError && <p className='text-red-500'>{brandsError.message}</p>}
        <ul className='mt-4'>
          {brandsData?.map((brand) => (
            <li key={brand.id}>{brand.name}</li>
          ))}
        </ul>
        <div className='mt-4'>
          <input
            type='text'
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder='New Brand'
            className='w-full rounded border p-2'
          />
          <button
            onClick={createBrandHandler}
            className='mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
            {createBrandIsLoading ? 'Creating...' : 'Create Brand'}
          </button>
          {createBrandError && <p className='text-red-500'>{createBrandError.message}</p>}
        </div>
      </div>
    </>
  );
}
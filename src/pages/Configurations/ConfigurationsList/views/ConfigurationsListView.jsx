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

    // OrderUpdate
  const {
    putResponse: classificationUpdateData,
    isLoading: classificationUpdateIsLoading,
    error: classificationUpdateError,
    fetchPut: classificationUpdateFetchPut,
  } = usePut();

  const {
    putResponse: brandUpdateData,
    isLoading: brandUpdateIsLoading,
    error: brandUpdateError,
    fetchPut: brandUpdateFetchPut,
  } = usePut();


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
      <div className="p-2 space-y-2">
      {/* Classifications Section */}
      <div className="rounded border p-4 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">Clasificaciones</h2>
        <div className="mb-2 flex gap-2">
          <button
            onClick={getClassificationsHandler}
            className="rounded text-xs bg-indigo-500 px-2 py-2 text-white hover:bg-indigo-600"
          >
            Ver Clasificaciones
          </button>
          <button
            onClick={createClassificationHandler}
            className="rounded bg-yellow-500 text-xs px-2 py-2 text-white hover:bg-yellow-600"
          >
            Crear Clasificación
          </button>
        </div>

        <div className="my-1">
          <input
            type="text"
            value={newClassification}
            onChange={(e) => setNewClassification(e.target.value)}
            placeholder="Nueva Clasificación"
            className="w-72 text-xs my-1 rounded border p-2"
          />
        </div>  
        {classificationsError && (
          <p className="text-red-500">{classificationsError.message}</p>
        )}
        {createClassificationError && (
          <p className="text-red-500">{createClassificationError.message}</p>
        )}
        <table className="w-full text-xs text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {classificationsData?.classifications.map((classification) => (
              <tr key={classification.id}>
                <td className="py-2 px-4 border-b">{classification.id}</td>
                <td className="py-2 px-4 border-b">
                  {classification.classificationName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Brands Section */}
      <div className="rounded border p-4 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">Marcas</h2>
        <div className="mb-2 flex gap-2">
          <button
            onClick={getBrandsHandler}
            className="rounded bg-indigo-500 text-xs px-2 py-2 text-white hover:bg-indigo-600"
          >
            Ver Marcas
          </button>
          <button
            onClick={createBrandHandler}
            className="rounded bg-yellow-500 text-xs px-2 py-2 text-white hover:bg-yellow-600"
          >
            Crear Marca
          </button>
        </div>

        <div className="my-1">
          <input
            type="text"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Nueva Marca"
            className="w-72 text-xs my-1 rounded border p-2"
          />
        </div>

        {brandsError && <p className="text-red-500">{brandsError.message}</p>}
        {createBrandError && (
          <p className="text-red-500">{createBrandError.message}</p>
        )}
        <table className="w-full text-xs text-left border border-gr ay-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {brandsData?.brands.map((brand) => (
              <tr key={brand.id}>
                <td className="py-2 px-4 border-b">{brand.id}</td>
                <td className="py-2 px-4 border-b">{brand.brandName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
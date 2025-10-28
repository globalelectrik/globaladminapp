import { useState } from 'react';
import { getAccessToken } from '../../utils/store/AccessTokenStore';

const usePostWithFiles = () => {
  const [postResponse, setPostResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostWithFiles = async (endpoint, data, files = {}) => {
    setIsLoading(true);
    setError(null);
    setPostResponse(null);

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      // Handle URL concatenation like axios does
      const baseUrl = import.meta.env.VITE_URL_BACKEND;
      let fullUrl;
      
      // If baseUrl ends with / and endpoint starts with /, remove one /
      if (baseUrl.endsWith('/') && endpoint.startsWith('/')) {
        fullUrl = baseUrl + endpoint.slice(1);
      } else if (!baseUrl.endsWith('/') && !endpoint.startsWith('/')) {
        // If neither ends/starts with /, add one
        fullUrl = baseUrl + '/' + endpoint;
      } else {
        // Otherwise, just concatenate
        fullUrl = baseUrl + endpoint;
      }

      console.log('🔵 Full URL:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setPostResponse(result);
        return result;
      } else {
        throw new Error(result.message || 'Error en la petición');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    postResponse,
    isLoading,
    error,
    fetchPostWithFiles,
  };
};

export default usePostWithFiles;
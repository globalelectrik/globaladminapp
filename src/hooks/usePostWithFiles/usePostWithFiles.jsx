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
      // Create FormData
      const formData = new FormData();
      
      // Append data as JSON string
      formData.append('data', JSON.stringify(data));
      
      // Append files if they exist
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}${endpoint}`, {
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
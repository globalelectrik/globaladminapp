import { useState } from 'react';
import createHttp from '../../services/BaseServices';
import { useLoadingContext } from '../../context/LoadingContext/LoadingContext';

const http = createHttp(true);

export default function usePut() {
  const { setIsLoadingContext } = useLoadingContext();

  const [putResponse, setPutResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPut = async (url, data) => {
    setPutResponse(null);
    setError(null);
    try {
      setIsLoading(true);
      setIsLoadingContext(true);
      const response = await http.put(url, data);
      console.log('HOOK put', response);
      setPutResponse(response);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    } finally {
      setIsLoading(false);
      setIsLoadingContext(false);
    }
  };

  return {
    putResponse,
    isLoading,
    error,
    fetchPut,
  };
}

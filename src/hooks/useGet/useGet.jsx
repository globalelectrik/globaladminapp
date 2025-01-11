import { useState } from 'react';
import createHttp from '../../services/BaseServices';
import { useLoadingContext } from '../../context/LoadingContext/LoadingContext';

const http = createHttp(true);

export default function useGet() {
  const { setIsLoadingContext } = useLoadingContext();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGet = async (url, data) => {
    try {
      setIsLoading(true);
      setIsLoadingContext(true);
      const response = await http.get(url);

      // console.log('HOOK: get', response);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsLoadingContext(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchGet,
  };
}

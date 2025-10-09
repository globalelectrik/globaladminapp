import { useState } from 'react';
import createHttp from '../../services/BaseServices';
import { useLoadingContext } from '../../context/LoadingContext/LoadingContext';

const http = createHttp(true);

export default function usePost() {
  const { setIsLoadingContext } = useLoadingContext();

  const [postResponse, setPostResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = async (url, data) => {
    setPostResponse(null);
    setError(null);
    try {
      setIsLoading(true);
      setIsLoadingContext(true);
      const response = await http.post(url, data);
      //console.log('HOOK post', response);
      setPostResponse(response);
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
    postResponse,
    isLoading,
    error,
    fetchPost,
  };
}

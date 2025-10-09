import axios from 'axios';
import { useState } from 'react';
import { useLoadingContext } from '../../context/LoadingContext/LoadingContext';

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

export default function useGetPdf() {
  const { setIsLoadingContext } = useLoadingContext();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 const fetchPdf = async (url, fileName = 'document.pdf') => {
    try {
      setIsLoading(true);
      setIsLoadingContext(true);

      // ✅ Prevent double slashes
      const fullUrl = `${URL_BACKEND.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

      const response = await axios.get(fullUrl, {
        responseType: 'blob',
        validateStatus: (status) => true, // Let us handle errors manually
      });

      const blob = response.data;

      if (
        response.status !== 200 ||
        !blob ||
        blob.size === 0 ||
        !response.headers['content-type']?.includes('pdf')
      ) {
        throw new Error('Invalid or empty PDF file');
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);

      setData(blob);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('❌ Error fetching or downloading PDF:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingContext(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchPdf,
  };
}

import { useState } from 'react';
import axios from 'axios';

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

const useGetXml = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchXml = async (endpoint, filename = 'file.xml', params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Prevent double slashes
      const fullUrl = `${URL_BACKEND.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
      
      const response = await axios.get(fullUrl, {
        params,
        responseType: 'blob',
        headers: {
          Accept: 'application/xml',
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/xml' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
    } catch (err) {
      console.error('XML fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchXml, loading, error };
};

export default useGetXml;
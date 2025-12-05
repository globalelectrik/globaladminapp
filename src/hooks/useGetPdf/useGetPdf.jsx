import axios from 'axios';
import { useState } from 'react';
import { useLoadingContext } from '../../context/LoadingContext/LoadingContext';

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

export default function useGetPdf() {
  const { setIsLoadingContext } = useLoadingContext();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPdf = async (url, fallbackFileName = 'document.pdf') => {
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

      // ✅ Extract filename from Content-Disposition header (from backend)
      let fileName = fallbackFileName;
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        // Try to match filename="F-8.pdf" or filename=F-8.pdf
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          // Remove quotes and use the extracted filename
          fileName = match[1].replace(/['"]/g, '');
          console.log("✅ Extracted filename from backend:", fileName);
        }
      }

      console.log("📥 Downloading PDF as:", fileName);

      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName; // ✅ Use extracted filename
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
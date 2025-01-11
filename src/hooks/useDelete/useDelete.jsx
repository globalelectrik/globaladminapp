import { useState } from 'react';
import createHttp from '../../services/BaseServices';

const http = createHttp(true);

export default function useDelete() {
	const [deleteResponse, setDeleteResponse] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchDelete = async (url) => {
		try {
			setIsLoading(true);
			const response = await http.delete(url);
			console.log('HOOK: delete', response);
			setDeleteResponse(response);
			setError(null);
		} catch (err) {
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		deleteResponse,
		isLoading,
		error,
		fetchDelete,
	};
}

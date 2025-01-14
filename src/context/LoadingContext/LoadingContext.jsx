import { createContext, useState, useContext, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoadingContext = () => useContext(LoadingContext);

export const LoadingContextProvider = ({ children }) => {
	const [isLoadingContext, setIsLoadingContext] = useState(false);

	const value = {
		isLoadingContext,
		setIsLoadingContext,
	};

	return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export default LoadingContext;

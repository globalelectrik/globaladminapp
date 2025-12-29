import { Search, X } from "lucide-react";
import { useState } from "react";


export default function SearchBar({searchIsLoading, searchError, searchData, searchFetchGet, ordersData, setOrdersData}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialRefSearch, setMaterialRefSearch] = useState('');
  const [vatNameSearch, setVatNameSearch] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (materialRefSearch.trim()) {
      params.append('materialReference', materialRefSearch.trim());
    }
    if (vatNameSearch.trim()) {
      params.append('vatName', vatNameSearch.trim());
    }

    if (params.toString()) {
      console.log("Search params:", params.toString());
      searchFetchGet(`/orders/search?${params.toString()}`);
      setIsModalOpen(false);
    }
  };

  const handleClear = () => {
    setVatNameSearch('');
    setMaterialRefSearch('');
    setOrdersData(ordersData);
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition"
      >
        <Search className="h-4 w-4" />
        Buscar
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Buscar Pedidos</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Fields */}
            <div className="space-y-4">

              {/* Material Reference Search */}
              <div>
                <label htmlFor="materialRefSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social
                </label>
                 <input
                  id="vatNameSearch"
                  type="text"
                  value={vatNameSearch}
                  onChange={(e) => setVatNameSearch(e.target.value)}
                  placeholder="Buscar por razón social..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
               
              </div>

              {/* VAT Name Search */}
              <div>
                <label htmlFor="vatNameSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Rerferencia del Material
                </label>
                <input
                  id="materialRefSearch"
                  type="text"
                  value={materialRefSearch}
                  onChange={(e) => setMaterialRefSearch(e.target.value)}
                  placeholder="Buscar por referencia..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition"
              >
                Limpiar
              </button>
              <button
                onClick={handleSearch}
                disabled={!materialRefSearch.trim() && !vatNameSearch.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

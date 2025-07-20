import React from "react";

export default function BrandsModal({ isOpen, onClose, brandsData, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md space-y-3">
        <h2 className="text-lg font-bold">Selecciona una Marca</h2>
        <ul className="space-y-2">
          {brandsData?.brands?.map((brand) => (
            <li
              key={brand.id}
              onClick={() => {
                onSelect(brand.id);
                onClose();
              }}
              className="cursor-pointer hover:bg-gray-100 rounded px-3 py-1"
            >
              {brand.brandName}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-gray-500 text-white py-2 hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

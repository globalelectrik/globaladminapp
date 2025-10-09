import React from "react";

export default function ClassificationsModal({ isOpen, onClose, classificationsData, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xs w-full max-h-96">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Selecciona una Clasificación</h2>
        </div>
        <div className="max-h-60 overflow-y-auto">
          <ul className="py-2">
            {classificationsData?.classifications?.map((classification) => (
              <li
                key={classification.id}
                onClick={() => {
                  onSelect(classification.id);
                  onClose();
                }}
                className="cursor-pointer hover:bg-blue-50 px-4 py-2 text-sm text-gray-700 hover:text-blue-700 transition-colors duration-150"
              >
                {classification.classificationName}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-gray-100 text-gray-700 py-2 px-3 text-sm hover:bg-gray-200 transition-colors duration-150"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

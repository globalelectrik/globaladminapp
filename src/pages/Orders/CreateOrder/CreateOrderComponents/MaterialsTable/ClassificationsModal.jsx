import React from "react";

export default function ClassificationsModal({ isOpen, onClose, classificationsData, onSelect }) {
  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md space-y-3">
        <h2 className="text-lg font-bold">Selecciona una Clasificación</h2>
        <ul className="space-y-2">
          {classificationsData?.classifications?.map((classification) => (
            <li
              key={classification.id}
              onClick={() => {
                onSelect(classification.id);
                onClose();
              }}
              className="cursor-pointer hover:bg-gray-100 rounded px-3 py-1"
            >
              {classification.classificationName}
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

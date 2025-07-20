import { useEffect, useState } from "react";

export default function CreatedOrderModal({ createOrderPostResponse }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sharepointURL, setSharepointURL] = useState("");
  const [resetForm, setResetForm] = useState(false);

  useEffect(() => {
    if (createOrderPostResponse?.message === "success") {
      setSharepointURL(createOrderPostResponse?.order.sharepointWebURL || "");
      setIsOpen(true);
      setResetForm(true);
    }
  }, [createOrderPostResponse]);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (resetForm) {
      const event = new CustomEvent("clearCreateOrderForm");
      window.dispatchEvent(event);
      setResetForm(false);
    }
  }, [resetForm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Pedido creado correctamente</h2>

        <p className="mb-2">Enlace a la carpeta de SharePoint:</p>
        <a
          href={sharepointURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline break-all"
        >
          {sharepointURL}
        </a>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
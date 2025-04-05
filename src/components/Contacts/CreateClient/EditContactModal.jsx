import { useState } from "react";

export default function EditContactModal({ contact, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...contact });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // calls editContactButtonHandler
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4">Editar Contacto</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="contactName"
            type="text"
            placeholder="Nombre"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="mobile"
            type="text"
            placeholder="Móvil"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="telephone"
            type="text"
            placeholder="Teléfono"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="position"
            type="text"
            placeholder="Cargo"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

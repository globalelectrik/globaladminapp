import { useEffect, useState } from "react";
import usePost from "../../../../hooks/usePost/usePost";
import useGet from "../../../../hooks/useGet/useGet";
import ClientsComboBox from './../../../Clients/ClientsComponents/ClientsComboBox/ClientsComboBox.jsx';

export default function CreateContactView() {
  const {
    data: clientsData,
    isLoading: clientsIsLoading,
    error: clientsError,
    fetchGet: clientsFetchGet,
  } = useGet();

  const {
    postResponse: createContactPostResponse,
    isLoading: createContactIsLoading,
    error: createContactError,
    fetchPost: createContactFetchPost,
  } = usePost();

  const [clientSelected, setClientSelected] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    mobile: "",
    telephone: "",
    position: "",
  });

  useEffect(() => {
    clientsFetchGet("/clients");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    if (!clientSelected) errors.push("Cliente");
    if (!formData.contactName.trim()) errors.push("Nombre");
    if (!formData.mobile.trim()) errors.push("Móvil");
    if (!formData.position.trim()) errors.push("Posición o Cargo");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    const data = {
      ...formData,
      company: clientSelected.id,
    };

    try {
      await createContactFetchPost("/contacts/createContact", data);
      setClientSelected(null);
      setSelectedCompany(null);
    } catch (err) {
      console.error("Error creating contact:", err.message);
    }
  };

  useEffect(() => {
    if (createContactPostResponse?.message === 'success') {
      setShowSuccessModal(true);
      setFormData({
        contactName: "",
        email: "",
        mobile: "",
        telephone: "",
        position: "",
      });
    }
  }, [createContactPostResponse]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      {/* ✅ Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-lg font-semibold text-green-600">✅ Contacto creado correctamente</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Crear Contacto</h2>

      {/* 🔴 Cuadro rojo de errores */}
      {formErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold block mb-2">Faltan campos obligatorios:</strong>
          <ul className="list-disc ml-5 text-sm">
            {formErrors.map((error, index) => (
              <li key={index}> {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Cliente***</label>
          <ClientsComboBox
            clients={clientsData?.clients}
            clientSelected={clientSelected}
            setClientSelected={setClientSelected}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nombre***</label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Correo electrónico</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Móvil***</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Posición o Cargo***</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={createContactIsLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
        >
          {createContactIsLoading ? "Creando..." : "Crear Contacto"}
        </button>

        {createContactError && (
          <p className="text-red-500 text-sm">Error: {createContactError.message}</p>
        )}
      </form>
    </div>
  );
}

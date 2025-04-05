import { useEffect, useState } from "react";
import usePost from "../../../../hooks/usePost/usePost";
import useGet from "../../../../hooks/useGet/useGet";
import ClientsComboBox from "../../../../components/Clients/ClientsComboBox/ClientsComboBox";
import CompaniesComboBox from "../../../../components/Clients/CompaniesComboBox/CompaniesComboBox";

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

    if (!clientSelected) {
      alert("Por favor selecciona un cliente.");
      return;
    }

    const data = {
      ...formData,
      company: clientSelected.id,
    };

    try {
      await createContactFetchPost("/contacts/createContact", data);
      setFormData({
        contactName: "",
        email: "",
        mobile: "",
        telephone: "",
        position: "",
      });
      setClientSelected(null);
      setSelectedCompany(null);
    } catch (err) {
      console.error("Error creating contact:", err.message);
    }
  };

  console.log("clientSelected-->> ",clientSelected);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Contacto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ClientsComboBox
          clients={clientsData?.clients}
          clientSelected={clientSelected}
          setClientSelected={(client) => {
            setClientSelected(client);
          }}
        />

        {/* Optional: Add back if needed
        <CompaniesComboBox
          companies={clientSelected?.companies || []}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        /> */}

        <input
          type="text"
          placeholder="Nombre***"
          value={formData.contactName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactName: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="email"
          placeholder="Correo***"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="tel"
          placeholder="Móvil***"
          value={formData.mobile}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, mobile: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.telephone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, telephone: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Posición/Cargo***"
          value={formData.position}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, position: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={createContactIsLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
        >
          {createContactIsLoading ? "Creando..." : "Crear Contacto"}
        </button>

        {createContactError && (
          <p className="text-red-500 text-sm">
            Error: {createContactError.message}
          </p>
        )}
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import useGet from "../../../../hooks/useGet/useGet";
import usePut from "../../../../hooks/usePut/usePut";
import EditContactModal from './../../ContactsComponents/EditContactModal.jsx';

export default function ContactsListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null); // For modal

  const {
    data: contactsData,
    fetchGet: contactsFetchGet,
  } = useGet();

  const {
    putResponse: updatedContactData,
    fetchPut: contactUpdateFetchPut,
  } = usePut();


  const seeContactsButtonHandler = () => {
    contactsFetchGet("/contacts");
  };

  const editContactButtonHandler = async (updatedContact) => {
    await contactUpdateFetchPut(
      `/contacts/contactUpdate/${updatedContact.id}`,
      updatedContact
    );
    setEditingContact(null);
    contactsFetchGet("/contacts"); 
  };

  const filteredContacts = contactsData?.contacts?.filter((contact) =>
    Object.values(contact).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Contactos</h2>
          <button
            className="rounded text-xs bg-indigo-500 px-2 py-2 text-white hover:bg-indigo-600"
            onClick={seeContactsButtonHandler}
          >
            Ver Contactos
          </button>
        </div>
        <NavLink
          to={"/contacts/newContact"}
          className="group flex items-center gap-x-2 rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white hover:bg-indigo-100 hover:text-indigo-600 hover:ring-1 hover:ring-indigo-600"
        >
          <PlusCircleIcon className="h-6 w-6" />
          Nuevo Contacto
        </NavLink>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar contacto..."
        className="w-full mb-2 p-2 border rounded text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Móvil</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Cargo</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts?.map((contact) => (
              <tr key={contact.id} className="border-t text-sm">
                <td className="p-3">{contact.contactName}</td>
                <td className="p-3">{contact.email}</td>
                <td className="p-3">{contact.mobile}</td>
                <td className="p-3">{contact.telephone}</td>
                <td className="p-3">{contact.position}</td>
                <td className="p-3 space-x-2 flex">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="text-indigo-600 hover:underline"
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setEditingContact(contact)}
                    className="text-yellow-600 hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {!filteredContacts?.length && (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No se encontraron contactos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contact Details */}
      {selectedContact && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow-inner">
          <h3 className="text-xl font-semibold mb-2">Detalles del contacto</h3>
          <p>
            <strong>Nombre:</strong> {selectedContact.contactName}
          </p>
          <p>
            <strong>Email:</strong> {selectedContact.email}
          </p>
          <p>
            <strong>Móvil:</strong> {selectedContact.mobile}
          </p>
          <p>
            <strong>Teléfono:</strong> {selectedContact.telephone}
          </p>
          <p>
            <strong>Cargo:</strong> {selectedContact.position}
          </p>
          <button
            onClick={() => setSelectedContact(null)}
            className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Contact Details Modal */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detalles del contacto</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 text-xl font-bold hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {selectedContact.contactName}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                <p><strong>Móvil:</strong> {selectedContact.mobile}</p>
                <p><strong>Teléfono:</strong> {selectedContact.telephone}</p>
                <p><strong>Cargo:</strong> {selectedContact.position}</p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
)}



      {/* Edit Modal */}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSave={editContactButtonHandler}
        />
      )}
    </div>
  );
}

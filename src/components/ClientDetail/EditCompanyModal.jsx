
export default function EditCompanyModal({
  newCompany,
  showEditCompanyModal,
  setShowEditCompanyModal,
  saveEditedCompany,
  handleNewCompanyChange
}) {
  const closeModal = () => {
    setShowEditCompanyModal(false); // Close the modal
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${showEditCompanyModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 space-y-4 w-96 shadow-lg">
        <h3 className="text-lg font-medium text-gray-800">Modificar Razón Social</h3>
        <input
          type="text"
          placeholder="Razón Social"
          className="w-full border rounded px-3 py-2"
          value={newCompany?.vatName || ""}
          onChange={(e) => handleNewCompanyChange("vatName", e.target.value)}
        />
        <input
          type="text"
          placeholder="RFC"
          className="w-full border rounded px-3 py-2"
          value={newCompany?.vatNumber || ""}
          onChange={(e) => handleNewCompanyChange("vatNumber", e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => closeModal()}  // Close modal on Cancel
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600"
            onClick={saveEditedCompany}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

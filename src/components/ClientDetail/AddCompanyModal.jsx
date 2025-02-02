

export default function AddCompanyModal ({ newCompany, closeCompanyModal, handleNewCompanyChange, addNewCompany }) {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96 shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Añadir Nueva Razón Social</h3>
            <input
              type="text"
              placeholder="Razón Social"
              className="w-full border rounded px-3 py-2"
              value={newCompany?.vatName}
              onChange={(e) => handleNewCompanyChange("vatName", e.target.value)}
            />
            <input
              type="text"
              placeholder="RFC"
              className="w-full border rounded px-3 py-2"
              value={newCompany?.vatNumber}
              onChange={(e) => handleNewCompanyChange("vatNumber", e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeCompanyModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600"
                onClick={addNewCompany}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
  )
};


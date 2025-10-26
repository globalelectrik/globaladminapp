import { useState, useRef, useEffect } from 'react';

export default function AddCompanyModal ({ newCompany, closeCompanyModal, handleNewCompanyChange, addNewCompany }) {

  const [isRegimeDropdownOpen, setIsRegimeDropdownOpen] = useState(false);
  const [regimeSearch, setRegimeSearch] = useState('');
  const regimeDropdownRef = useRef(null);

  const regimeOptions = [
    { value: "", label: "Seleccione un régimen" },
    { value: "601", label: "601 — General de Ley Personas Morales" },
    { value: "603", label: "603 — Personas Morales con Fines no Lucrativos" },
    { value: "605", label: "605 — Sueldos y Salarios e Ingresos Asimilados a Salarios" },
    { value: "606", label: "606 — Arrendamiento" },
    { value: "607", label: "607 — Régimen de Enajenación o Adquisición de Bienes" },
    { value: "608", label: "608 — Demás ingresos" },
    { value: "610", label: "610 — Residentes en el Extranjero sin EP en México" },
    { value: "611", label: "611 — Ingresos por Dividendos (socios y accionistas)" },
    { value: "612", label: "612 — Personas Físicas con Actividades Empresariales y Profesionales" },
    { value: "614", label: "614 — Ingresos por intereses" },
    { value: "615", label: "615 — Régimen de los ingresos por obtención de premios" },
    { value: "616", label: "616 — Sin obligaciones fiscales" },
    { value: "620", label: "620 — Sociedades Cooperativas de Producción (diferimiento)" },
    { value: "621", label: "621 — Incorporación Fiscal" },
    { value: "622", label: "622 — Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
    { value: "623", label: "623 — Opcional para Grupos de Sociedades" },
    { value: "624", label: "624 — Coordinados" },
    { value: "625", label: "625 — Actividades Empresariales vía Plataformas Tecnológicas" },
    { value: "626", label: "626 — Régimen Simplificado de Confianza" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regimeDropdownRef.current && !regimeDropdownRef.current.contains(event.target)) {
        setIsRegimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter regime options based on search
  const filteredRegimeOptions = regimeOptions.filter(option =>
    option.label.toLowerCase().includes(regimeSearch.toLowerCase())
  );

  // Get the label of selected regime
  const selectedRegimeLabel = regimeOptions.find(opt => opt.value === newCompany?.companyRegime)?.label || "Seleccione un régimen";

  const handleRegimeSelect = (value) => {
    handleNewCompanyChange("companyRegime", value);
    setIsRegimeDropdownOpen(false);
    setRegimeSearch('');
  };

  console.log('New Company Data:', newCompany);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 space-y-4 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Añadir Nueva Razón Social</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Razón Social"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newCompany?.vatName || ""}
              onChange={(e) => handleNewCompanyChange("vatName", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFC <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              placeholder="RFC"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newCompany?.vatNumber || ""}
              onChange={(e) => handleNewCompanyChange("vatNumber", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newCompany?.companyCountry || "MEX"}
              onChange={(e) => handleNewCompanyChange("companyCountry", e.target.value)}
            >
              <option value="MEX">México</option>
              <option value="USA">Estados Unidos</option>
              <option value="CAN">Canadá</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="md:col-span-2" ref={regimeDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Régimen Fiscal <span className="text-indigo-500">*</span>
            </label>
            
            {/* Custom Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRegimeDropdownOpen(!isRegimeDropdownOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white flex items-center justify-between"
              >
                <span className={newCompany?.companyRegime ? "text-gray-900" : "text-gray-500"}>
                  {selectedRegimeLabel}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isRegimeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown List */}
              {isRegimeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  
                  {/* Scrollable Options List - MAX 6 ITEMS VISIBLE */}
                  <div className="max-h-40 overflow-y-auto">
                    {filteredRegimeOptions.length > 0 ? (
                      filteredRegimeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleRegimeSelect(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${
                            option.value === newCompany?.companyRegime
                              ? 'bg-indigo-100 text-indigo-700 font-medium'
                              : 'text-gray-900'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Código Postal"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newCompany?.companyZipCode || ""}
              onChange={(e) => handleNewCompanyChange("companyZipCode", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="correo@empresa.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newCompany?.companyEmail || ""}
              onChange={(e) => handleNewCompanyChange("companyEmail", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            onClick={closeCompanyModal}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            onClick={addNewCompany}
          >
            Agregar Razón Social
          </button>
        </div>
      </div>
    </div>
  )
};


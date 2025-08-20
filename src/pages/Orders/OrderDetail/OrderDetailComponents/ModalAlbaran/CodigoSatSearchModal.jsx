import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import useGet from "../../../../../hooks/useGet/useGet";

export default function CodigoSatSearchModal({ open, onClose, onPick, setOrderSelected }) {
  const [q, setQ] = useState("");

  const {
    data: satProductData,
    isLoading: satProductIsLoading,
    error: satProductError,
    fetchGet: satProductFetchGet,
  } = useGet();

  // Derive results from hook data
  const results = Array.isArray(satProductData?.results) ? satProductData.results : [];

  const handleSearch = async () => {
    const term = q.trim();
    if (!term) return;
    // Trigger your GET; useGet handles isLoading/data/error
    satProductFetchGet(`/facturaCom/search/${encodeURIComponent(term)}?limit=100`);
  };

  // Allow Enter to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Reset query (and implicitly hide results) when closing
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4">
          <DialogPanel className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow">
            <DialogTitle className="text-lg font-semibold">Buscar Código SAT</DialogTitle>

            <div className="mt-3 flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe algunas letras o código (p. ej. 'equipo' o '2010')"
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!q.trim() || satProductIsLoading}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {satProductIsLoading ? "Buscando…" : "Buscar"}
              </button>
            </div>

            {satProductError && (
              <p className="mt-2 text-xs text-red-600">Error buscando códigos. Intenta de nuevo.</p>
            )}

            <div className="mt-3 max-h-[55vh] overflow-auto rounded-md border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Código</th>
                    <th className="text-left px-3 py-2 font-medium">Nombre</th>
                    <th className="text-left px-3 py-2 font-medium">Complemento</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((r) => (
                    <tr key={`${r.key}-${r.name}`}>
                      <td className="px-3 py-2 font-mono">{r.key}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.complement}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            onPick?.(r); // { key, name, complement }
                            onClose();
                            setQ("");
                          }}
                          className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!satProductIsLoading && results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                        {q ? "Sin resultados." : "Escribe y presiona Buscar."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

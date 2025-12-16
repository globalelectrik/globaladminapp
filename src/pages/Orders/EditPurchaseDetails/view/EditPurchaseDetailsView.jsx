import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../../../../hooks/useGet/useGet';
import { formatCurrency } from '../../../../utils/helpers/formatCurrency';
import usePost from '../../../../hooks/usePost/usePost';
import useDelete from '../../../../hooks/useDelete/useDelete';
import { CrossIcon, DeleteIcon } from 'lucide-react';

export default function EditPurchaseDetailsView() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [newDelivery, setNewDelivery] = useState({
    deliveryType: '',
    deliveryCompany: '',
    deliveryId: '',
    rececivedOk: false,
    purchasingDeliveryComments: [],
    purchasingDeliveryUpdates: [],
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const {
    data: purchaseData,
    isLoading: purchaseIsLoading,
    error: purchaseError,
    fetchGet: purchaseFetchGet,
  } = useGet();

  const {
    postResponse: createPurchaseDeliveryPostResponse,
    isLoading: createPurchaseDeliveryIsLoading,
    error: createPurchaseDeliveryError,
    fetchPost: createPurchaseDeliveryFetchPost,
  } = usePost();

  const {
    deleteResponse: deleteDeliveryResponse,
    isLoading: deleteDeliveryIsLoading,
    error: deleteDeliveryError,
    fetchDelete: deleteDeliveryFetchDelete,
  } = useDelete();

  useEffect(() => {
    purchaseFetchGet(`/purchases/purchaseDetail/${id}`);
  }, []);

  useEffect(() => {
    if (purchaseData) {
      setPurchase(purchaseData.purchase);
    }
  }, [purchaseData]);

  useEffect(() => {
    if (createPurchaseDeliveryPostResponse) {
      setPurchase(createPurchaseDeliveryPostResponse.purchase);
    }
  }, [createPurchaseDeliveryPostResponse]);

  useEffect(() => {
    if (deleteDeliveryResponse) {
      setPurchase(deleteDeliveryResponse.purchase);
    }
  }, [deleteDeliveryResponse]);

  if (purchaseError) {
    return <p className="text-center py-6 text-red-600">Error al cargar los datos de la compra.</p>;
  }

  if (!purchase) return null;

  const handleSavePurchase = async () => {
    await createPurchaseDeliveryFetchPost(`/purchases/purchaseDelivery/${id}`, newDelivery);
    setNewDelivery({
      deliveryType: '',
      deliveryCompany: '',
      deliveryId: '',
      rececivedOk: false,
      purchasingDeliveryComments: [],
      purchasingDeliveryUpdates: [],
    });
  };

  const handleDeleteDelivery = async (deliveryId) => {
    if (window.confirm("¿Estás seguro que deseas eliminar esta entrega?")) {
      await deleteDeliveryFetchDelete(`/purchases/purchaseDelivery/${id}/${deliveryId}`);
    }
  };

  const shortLink = (link) => {
    if (!link) return 'N/A';
    return link.length > 25 ? `${link.substring(0, 25)}...` : link;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold border-b pb-2">Detalle de Compra</h1>

      {/* Información general */}
     {/* Información general en tabla */}
       <section className="overflow-x-auto">
          <table className="w-full border text-sm">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-medium text-gray-800">Material:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.material?.materialName}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">Referencia:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.material?.materialReference}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium text-gray-800">Marca:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.material?.materialBrand?.brandName ?? 'N/A'}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">Precio Total:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{formatCurrency(purchase?.purchasingTotal)}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-medium text-gray-800">Cantidad:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.purchasingQuantity}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">Tipo de proveedor:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.supplierType}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium text-gray-800">Entregado a almacén:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">{purchase?.deliveredToWarehouse ? 'Sí' : 'No'}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">Enlace a compra:</td>
                <td className="border px-4 py-2 font-normal text-gray-600">
                  <a
                    className="text-indigo-600 underline"
                    href={purchase?.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortLink(purchase?.purchaseLink)}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>



      {/* Información de entregas */}
      <section>
        <div className='flex justify-between pb-2'>
          <h2 className="text-lg font-semibold mb-1">Entregas de proveedores a GE Mx</h2>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
          >
            {showNewForm ? 'Cancelar' : 'Añadir entrega'}
          </button>
        </div>

        {/* Formulario nueva entrega */}
        {showNewForm && (
          <div className="border p-4 rounded bg-gray-50 space-y-3 text-sm">
            <div className='flex justify-between'>
              <h2 className="text-lg font-bold mb-2">Nueva entrega de proveedor</h2>
              <button
                onClick={handleSavePurchase}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Guardar entrega
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium">Tipo de entrega</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={newDelivery.deliveryType}
                  onChange={e => setNewDelivery({ ...newDelivery, deliveryType: e.target.value })}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Intermediario">Intermediario</option>
                  <option value="Almacén final">Almacén final</option>
                  <option value="Otro (agregar comentario)">Otro (agregar comentario)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Courier</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={newDelivery.deliveryCompany}
                  onChange={e => setNewDelivery({ ...newDelivery, deliveryCompany: e.target.value })}
                >
                  <option value="">Selecciona Courier</option>
                  <option value="DHL">DHL</option>
                  <option value="UPS">UPS</option>
                  <option value="USPS">USPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="Other">Otra</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">ID de entrega</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={newDelivery.deliveryId}
                  onChange={e => setNewDelivery({ ...newDelivery, deliveryId: e.target.value })}
                />
              </div>
      
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={newDelivery.rececivedOk}
                  onChange={e => setNewDelivery({ ...newDelivery, rececivedOk: e.target.checked })}
                />
                <label>¿Recibido OK?</label>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {purchase.purchasingDelivery.map((delivery, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className='flex justify-between'>
                <h3 className="font-bold text-sm mb-2">Entrega #{index + 1}</h3>
                <DeleteIcon
                  onClick={() => handleDeleteDelivery(delivery.id)}
                  className="text-red-600 rounded-lg hover:underline text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>Tipo:</strong> {delivery.deliveryType}</div>
                <div><strong>Empresa:</strong> {delivery.deliveryCompany}</div>
                <div><strong>ID de entrega:</strong> {delivery.deliveryId || 'N/A'}</div>
                <div><strong>Recibido OK:</strong> {delivery.rececivedOk ? 'Sí' : 'No'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

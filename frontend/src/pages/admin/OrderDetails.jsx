import { X } from 'lucide-react';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En cours' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Expédiée' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Livrée' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulée' },
};

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  const statusInfo = statusColors[order.status] || statusColors.pending;
  
  const createdDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Numéro de commande</p>
              <p className="text-2xl font-bold text-gray-900">{order.order_number}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Customer Info Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Informations client</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nom complet</p>
                <p className="text-gray-900 font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <a href={`mailto:${order.customer_email}`} className="text-blue-600 hover:underline">
                  {order.customer_email}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Adresse de livraison</h3>
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {order.shipping_address || 'Non spécifiée'}
            </p>
          </div>

          {/* Order Summary Grid */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-xs text-emerald-700 mb-1 font-medium">Montant total</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {Number(order.total_amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-blue-700 mb-1 font-medium">Articles</p>
                <p className="text-2xl font-bold text-blue-900">{order.items_count}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Date de commande</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">{createdDate}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-sm">
              Marquer comme livrée
            </button>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-sm">
              Imprimer l'étiquette
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
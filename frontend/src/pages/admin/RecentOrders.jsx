import { Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    {
      id: '#ORD-2024-001',
      customer: 'Jean Dupont',
      amount: '€245.99',
      date: "Aujourd'hui",
      status: 'completed',
    },
    {
      id: '#ORD-2024-002',
      customer: 'Marie Martin',
      amount: '€189.50',
      date: "Aujourd'hui",
      status: 'processing',
    },
    {
      id: '#ORD-2024-003',
      customer: 'Pierre Bernard',
      amount: '€325.00',
      date: 'Hier',
      status: 'completed',
    },
    {
      id: '#ORD-2024-004',
      customer: 'Sophie Laurent',
      amount: '€156.75',
      date: 'Hier',
      status: 'pending',
    },
    {
      id: '#ORD-2024-005',
      customer: 'Luc Moreau',
      amount: '€412.30',
      date: '2 jours',
      status: 'completed',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50';
      case 'processing':
        return 'bg-blue-50';
      case 'pending':
        return 'bg-amber-50';
      case 'cancelled':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Livré';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Commandes récentes</h2>
        <p className="text-gray-600 text-sm mt-1">Les 5 dernières commandes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-600">Affichage de 5 commandes sur 1,245</p>
        <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
          Voir toutes les commandes
        </button>
      </div>
    </div>
  );
};

export default RecentOrders;
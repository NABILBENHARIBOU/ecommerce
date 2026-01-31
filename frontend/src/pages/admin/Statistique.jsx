import { TrendingUp, DollarSign, Package, ShoppingCart, Calendar } from 'lucide-react';

const Statistics = () => {
  // Données de démonstration (à remplacer par vos données réelles)
  const mockOrders = [
    { id: '1', status: 'delivered', total_amount: 150.50, items_count: 3, created_at: '2024-03-01' },
    { id: '2', status: 'processing', total_amount: 85.00, items_count: 1, created_at: '2024-03-05' },
    { id: '3', status: 'delivered', total_amount: 210.00, items_count: 4, created_at: '2024-02-15' },
    { id: '4', status: 'pending', total_amount: 45.00, items_count: 2, created_at: '2024-03-10' },
    { id: '5', status: 'cancelled', total_amount: 120.00, items_count: 2, created_at: '2024-01-20' },
  ];

  const calculateStats = () => {
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrder = mockOrders.length > 0 ? totalRevenue / mockOrders.length : 0;
    const totalItems = mockOrders.reduce((sum, order) => sum + order.items_count, 0);

    const statusCounts = {
      pending: mockOrders.filter((o) => o.status === 'pending').length,
      processing: mockOrders.filter((o) => o.status === 'processing').length,
      shipped: mockOrders.filter((o) => o.status === 'shipped').length,
      delivered: mockOrders.filter((o) => o.status === 'delivered').length,
      cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
    };

    const thisMonth = mockOrders.filter((o) => {
      const orderDate = new Date(o.created_at);
      const today = new Date();
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    });

    const monthlyRevenue = thisMonth.reduce((sum, order) => sum + order.total_amount, 0);

    return {
      totalRevenue,
      averageOrder,
      totalItems,
      statusCounts,
      monthlyRevenue,
      thisMonthOrders: thisMonth.length,
    };
  };

  const stats = calculateStats();

  const getMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = Array(12).fill(0);

    mockOrders.forEach((order) => {
      const month = new Date(order.created_at).getMonth();
      data[month] += order.total_amount;
    });

    const maxValue = Math.max(...data, 1);

    return months.map((month, index) => ({
      month,
      value: data[index],
      percentage: (data[index] / maxValue) * 100,
    }));
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité commerciale</p>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}€</p>
              <p className="text-xs text-emerald-600 mt-2">Ce mois: {stats.monthlyRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-emerald-100 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Commandes totales</p>
              <p className="text-3xl font-bold text-gray-900">{mockOrders.length}</p>
              <p className="text-xs text-blue-600 mt-2">{stats.thisMonthOrders} ce mois</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Panier moyen</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageOrder.toFixed(2)}€</p>
              <p className="text-xs text-gray-500 mt-2">{stats.totalItems} articles</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taux de livraison</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockOrders.length > 0 ? ((stats.statusCounts.delivered / mockOrders.length) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-emerald-600 mt-2">{stats.statusCounts.delivered} livrées</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution des Statuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Distribution des statuts</h2>
          <div className="space-y-4">
            {[
              { label: 'Livrées', value: stats.statusCounts.delivered, textColor: 'text-emerald-700', barColor: 'bg-emerald-500' },
              { label: 'Expédiées', value: stats.statusCounts.shipped, textColor: 'text-purple-700', barColor: 'bg-purple-500' },
              { label: 'En cours', value: stats.statusCounts.processing, textColor: 'text-blue-700', barColor: 'bg-blue-500' },
              { label: 'En attente', value: stats.statusCounts.pending, textColor: 'text-yellow-700', barColor: 'bg-yellow-500' },
              { label: 'Annulées', value: stats.statusCounts.cancelled, textColor: 'text-red-700', barColor: 'bg-red-500' },
            ].map((status) => {
              const percentage = mockOrders.length > 0 ? (status.value / mockOrders.length) * 100 : 0;
              return (
                <div key={status.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status.label}</span>
                    <span className={`text-sm font-bold ${status.textColor}`}>{status.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${status.barColor} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenu par Statut */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenu par statut</h2>
          <div className="space-y-4">
            {[
              { label: 'Livrées', status: 'delivered', color: 'bg-emerald-50', textColor: 'text-emerald-700' },
              { label: 'Expédiées', status: 'shipped', color: 'bg-purple-50', textColor: 'text-purple-700' },
              { label: 'En cours', status: 'processing', color: 'bg-blue-50', textColor: 'text-blue-700' },
              { label: 'En attente', status: 'pending', color: 'bg-yellow-50', textColor: 'text-yellow-700' },
              { label: 'Annulées', status: 'cancelled', color: 'bg-red-50', textColor: 'text-red-700' },
            ].map((item) => {
              const revenue = mockOrders
                .filter((o) => o.status === item.status)
                .reduce((sum, o) => sum + o.total_amount, 0);

              return (
                <div key={item.status} className={`${item.color} rounded-lg p-4 flex items-center justify-between`}>
                  <span className={`text-sm font-medium ${item.textColor}`}>{item.label}</span>
                  <span className={`text-lg font-bold ${item.textColor}`}>{revenue.toFixed(2)}€</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Graphique Mensuel Simple */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Chiffre d'affaires mensuel</h2>
        <div className="flex items-end justify-between h-64 gap-2">
          {monthlyData.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end group">
              <div
                className="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-600 cursor-pointer"
                style={{ height: `${month.percentage}%`, minHeight: month.value > 0 ? '4px' : '0px' }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-emerald-800 text-center -mt-6">
                  {month.value > 0 ? `${month.value.toFixed(0)}€` : ''}
                </div>
              </div>
              <span className="text-[10px] text-gray-500 mt-2">{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {mockOrders.length > 0 ? ((stats.statusCounts.delivered / mockOrders.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Livrées vs Total</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">En cours</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {stats.statusCounts.processing + stats.statusCounts.pending}
          </p>
          <p className="text-xs text-gray-500 mt-1">À préparer</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">Quotidien</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {(stats.totalRevenue / 30).toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">Moyenne estimée</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
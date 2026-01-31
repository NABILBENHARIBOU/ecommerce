const SalesChart = () => {
  const data = [
    { month: 'Jan', sales: 4000 },
    { month: 'Fév', sales: 3000 },
    { month: 'Mar', sales: 2000 },
    { month: 'Avr', sales: 2780 },
    { month: 'Mai', sales: 1890 },
    { month: 'Jun', sales: 2390 },
    { month: 'Jul', sales: 3490 },
  ];

  const maxSales = Math.max(...data.map(d => d.sales));

  return (
    <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Ventes mensuelles</h2>
        <p className="text-gray-600 text-sm mt-1">Tendance des 7 derniers mois</p>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = (item.sales / maxSales) * 100;
          return (
            <div key={item.month} className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
              <div className="flex-1 ml-4">
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-16 text-right">€{item.sales}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Total des ventes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">€20,550</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-600 text-sm font-medium">↑ 12.5%</p>
            <p className="text-gray-600 text-xs mt-1">vs période précédente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

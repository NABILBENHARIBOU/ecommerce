import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    bar: 'bg-emerald-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    bar: 'bg-blue-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    bar: 'bg-amber-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    bar: 'bg-purple-600',
  },
};

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
  const colors = colorMap[color] || colorMap.blue; // Fallback par sécurité
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-3">{value}</p>

      <div className="flex items-center">
        <div className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? (
            <>
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">{Math.abs(change)}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">{Math.abs(change)}%</span>
            </>
          )}
        </div>
        <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
      </div>

      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        {/* J'ai gardé le w-3/4 (75%), mais tu peux le rendre dynamique si besoin */}
        <div className={`h-full ${colors.bar} w-3/4`}></div>
      </div>
    </div>
  );
};

export default StatCard;
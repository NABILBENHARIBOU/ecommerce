import { CheckCircle } from 'lucide-react';

export default function ProductFeatures({ features }) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h3>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

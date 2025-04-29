'use client';
import { FaPlus } from 'react-icons/fa';

export default function BiographySection() {
  return (
    <div className="px-6 py-4 border-t">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Biographie</h3>
        <button className="text-orange-500 text-xs font-medium hover:text-orange-600 flex items-center">
          <FaPlus className="h-3 w-3 mr-1" /> Ajouter
        </button>
      </div>
      <div className="text-sm text-gray-500 italic">
        Ajoutez une biographie pour en savoir plus sur cette personne...
      </div>
    </div>
  );
}
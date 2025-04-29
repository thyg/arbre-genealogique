'use client';
import { FaPlus } from 'react-icons/fa';

export default function MediaSection() {
  return (
    <div className="px-6 py-4 border-t">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Photos et vidéos</h3>
        <button className="text-orange-500 text-xs font-medium hover:text-orange-600 flex items-center">
          <FaPlus className="h-3 w-3 mr-1" /> Ajouter
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <FaPlus className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
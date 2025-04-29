'use client';
import { FaPlus, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useUserContext } from '@/app/tree/UserContext';

export default function EventsSection() {
  const { userData, expandedSections, toggleSection } = useUserContext();

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={() => toggleSection('events')} 
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center"
        >
          Événements
          {expandedSections.events ? (
            <FaChevronUp className="h-3 w-3 ml-2" />
          ) : (
            <FaChevronDown className="h-3 w-3 ml-2" />
          )}
        </button>
        <button className="text-orange-500 text-xs font-medium hover:text-orange-600 flex items-center">
          <FaPlus className="h-3 w-3 mr-1" /> Ajouter
        </button>
      </div>
      {expandedSections.events && (
        <div className="mt-2 space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
            <div className="flex">
              <div className="w-12 text-sm font-medium text-gray-700">{userData.birthDate}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">Naissance</div>
                <div className="text-xs text-gray-500">{userData.birthPlace}</div>
              </div>
            </div>
          </div>
          {userData.marriageDate && (
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex">
                <div className="w-12 text-sm font-medium text-gray-700">{userData.marriageDate}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Mariage</div>
                  <div className="text-xs text-gray-500">{userData.marriagePlace}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
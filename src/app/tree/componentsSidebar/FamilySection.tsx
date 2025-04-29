'use client';
import { FaPlus, FaUser, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useUserContext } from '@/app/tree/UserContext';

export default function FamilySection() {
  const { userData, expandedSections, toggleSection } = useUserContext();

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={() => toggleSection('family')} 
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center"
        >
          Famille immédiate
          {expandedSections.family ? (
            <FaChevronUp className="h-3 w-3 ml-2" />
          ) : (
            <FaChevronDown className="h-3 w-3 ml-2" />
          )}
        </button>
        <button className="text-orange-500 text-xs font-medium hover:text-orange-600 flex items-center">
          <FaPlus className="h-3 w-3 mr-1" /> Ajouter
        </button>
      </div>
      {expandedSections.family && (
        <div className="mt-2 space-y-2">
          {userData.spouse ? (
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">{userData.spouse}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{userData.relation}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
              <div className="text-sm font-medium text-gray-700">Aucun membre de famille ajouté</div>
              <div className="text-xs text-gray-500 mt-1">Ajoutez des parents, des frères et sœurs, ou d'autres membres de la famille</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
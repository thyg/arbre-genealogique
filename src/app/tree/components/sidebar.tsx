import React, { useState } from 'react';
import ModifyProfil from './modifyprofil';
import { Person } from '../types/person';

interface SidebarProps {
  selectedPerson: Person | null;
  onPersonUpdate: () => void;
  treeId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPerson, onPersonUpdate, treeId }) => {
  const [activeTab, setActiveTab] = useState('profil');
  const [showModifyProfile, setShowModifyProfile] = useState(false);

  // Handle tab selection
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (!selectedPerson) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto h-full">
        <div className="p-4 text-center text-gray-500">
          Sélectionnez une personne pour voir les détails
        </div>
      </div>
    );
  }

  // Calculate age based on birth date
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(selectedPerson.birthDate);

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto h-full">
      {/* Profile header */}
      <div className="relative">
        {selectedPerson.id === 0 ? (
          <div className="p-4 flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-800">
                C'est vous
              </h2>
            </div>
          </div>
        ) : (
          <div className="p-4 flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              {selectedPerson.gender === 'MALE' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-800">
                {selectedPerson.firstName} {selectedPerson.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                {age !== null ? `(âge de ${age} ans)` : ''}
              </p>
            </div>
          </div>
        )}

        {/* Profile nav icons */}
        <div className="absolute right-4 top-4 flex space-x-2">
          <button
            onClick={() => setShowModifyProfile(true)}
            className="text-gray-500 hover:text-gray-700"
            title="Modifier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'profil' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabClick('profil')}
        >
          Profil
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'modifier' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabClick('modifier')}
        >
          Modifier
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'ajouter' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabClick('ajouter')}
        >
          Ajouter
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'plus' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabClick('plus')}
        >
          Plus
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'profil' && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">DÉCOUVERTES</h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Une incohérence
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-2">PHOTOS ET VIDÉOS</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Aucune photo</span>
              <button className="text-sm text-orange-500">+ Ajouter</button>
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-2">BIOGRAPHIE</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Aucune biographie</span>
              <button className="text-sm text-orange-500">+ Ajouter</button>
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-2">FAMILLE IMMÉDIATE</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Aucun membre</span>
              <button className="text-sm text-orange-500">+ Ajouter</button>
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-2">ÉVÉNEMENTS</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">2004</span>
                <button className="text-sm text-orange-500">+ Ajouter</button>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Naissance</span>
              </div>
              <div className="ml-8 text-sm text-gray-500">2004</div>
            </div>
            
            <div className="text-center mt-6">
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Faire un test ADN
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'modifier' && (
          <div>
            <p className="text-sm text-gray-600">Options de modification du profil</p>
          </div>
        )}
        
        {activeTab === 'ajouter' && (
          <div>
            <p className="text-sm text-gray-600">Options d'ajout de relations</p>
          </div>
        )}
        
        {activeTab === 'plus' && (
          <div>
            <p className="text-sm text-gray-600">Options supplémentaires</p>
          </div>
        )}
      </div>

      {/* Modify Profile Modal */}
      {showModifyProfile && (
        <ModifyProfil 
          person={selectedPerson} 
          onClose={() => setShowModifyProfile(false)} 
          onUpdate={onPersonUpdate}
        />
      )}
    </div>
  );
};

export default Sidebar;
'use client';
import { FaUser, FaPlus, FaEdit, FaEllipsisH, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';
import React from 'react';

export default function TreeSidebar({ userData, updateUserData, onEditClick }) {
  const [view, setView] = useState('default'); // 'default' ou 'profile'
  const [tempImage, setTempImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
        updateUserData({ profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileClick = () => {
    setView('profile');
  };

  const handleBackClick = () => {
    setView('default');
  };

  const handleEditClick = () => {
    // Appel de la fonction pour ouvrir le formulaire d'édition
    if (onEditClick) {
      onEditClick();
    }
  };

  return (
    <div className="w-85 bg-white border-r border-gray-200 shadow-inner h-full flex flex-col">
      {view === 'profile' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              <span>Retour</span>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-10 w-10 text-gray-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                  <FaCamera className="h-4 w-4 text-gray-600" />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 text-center">{userData.userName}</h2>
              <p className="text-sm text-gray-500 text-center">{userData.treeName}</p>
              
              {/* Ajout du bouton Modifier */}
              <button 
                onClick={handleEditClick}
                className="mt-2 px-4 py-2 flex items-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaEdit className="mr-2" /> Modifier le profil
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Informations personnelles</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Sexe</p>
                  <p className="text-sm text-gray-900 capitalize">{userData.gender || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date de naissance</p>
                  <p className="text-sm text-gray-900">{userData.birthDate || 'Non spécifiée'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lieu de naissance</p>
                  <p className="text-sm text-gray-900">{userData.birthPlace || 'Non spécifié'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Arbre généalogique</h3>
              <p className="text-sm text-gray-900">{userData.treeName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Dernière mise à jour</h3>
              <p className="text-xs text-gray-500">Aujourd'hui à {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-5 w-5 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                  <FaCamera className="h-2.5 w-2.5 text-gray-600" />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">{userData.userName}</h2>
                <p className="text-xs text-gray-500">C'est vous</p>
                <p className="text-xs text-gray-500">
                  {userData.birthDate} {userData.birthDate && userData.birthPlace ? '• ' : ''} {userData.birthPlace}
                </p>
              </div>
            </div>
            <button className="mt-3 text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer transition-colors duration-200 flex items-center">
              Rechercher cette personne <span className="ml-1">&gt;</span>
            </button>

            <div className="mt-4 flex justify-between space-x-2">
              <button 
                onClick={handleProfileClick}
                className="flex flex-col items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-1">
                  <FaUser className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-gray-600">Profil</span>
              </button>
              
              <button 
                onClick={handleEditClick}
                className="flex flex-col items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-1">
                  <FaEdit className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-gray-600">Modifier</span>
              </button>
              
              <button className="flex flex-col items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-1">
                  <FaEllipsisH className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-gray-600">Plus</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Découvertes</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="mr-2 flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">i</span>
                  Une incohérence
                </li>
              </ul>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Photos et vidéos</h3>
                <button className="text-orange-600 text-xs font-medium hover:text-orange-700 transition-colors duration-200 flex items-center">
                  <FaPlus className="mr-1" size={10} /> Ajouter
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Biographie</h3>
                <button className="text-orange-600 text-xs font-medium hover:text-orange-700 transition-colors duration-200 flex items-center">
                  <FaPlus className="mr-1" size={10} /> Ajouter
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  Famille immédiate
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </h3>
                <button className="text-orange-600 text-xs font-medium hover:text-orange-700 transition-colors duration-200 flex items-center">
                  <FaPlus className="mr-1" size={10} /> Ajouter
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  Événements
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </h3>
                <button className="text-orange-600 text-xs font-medium hover:text-orange-700 transition-colors duration-200 flex items-center">
                  <FaPlus className="mr-1" size={10} /> Ajouter
                </button>
              </div>
              <div>
                <div className="flex mb-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-12 text-sm font-medium text-gray-700">2004</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">Naissance</div>
                    <div className="text-xs text-gray-500">2004</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="p-4 border-t border-gray-200">
        <button className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
          Faire un test ADN
        </button>
        <button className="mt-2 block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
          Importer des données ADN
        </button>
      </div>
    </div>
  );
}
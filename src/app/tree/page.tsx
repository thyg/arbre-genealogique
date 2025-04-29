'use client';
import { useState, useEffect } from 'react';
import TreeSidebar from './TreeSidebar';
import TreeGraph from './TreeGraph';
import { FaSearch } from 'react-icons/fa';

export default function TreeLayout() {
  const [userData, setUserData] = useState({
    treeName: '',
    userName: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    profileImage: null
  });
  
  // Fonction pour mettre à jour les données partagées
  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
    // Sauvegarde dans localStorage si nécessaire
    Object.entries(newData).forEach(([key, value]) => {
      if (value !== null) localStorage.setItem(key, value);
    });
  };
  const [isEditing, setIsEditing] = useState(false);
  
    // État temporaire pour stocker les modifications avant enregistrement
  const [editForm, setEditForm] = useState({...userData});
  // Fonction pour mettre à jour les données utilisateur
  // const updateUserData = (newData) => {
  //   setUserData(prevData => ({
  //     ...prevData,
  //     ...newData
  //   }));
  // };

  // Gestion de la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

    // Gestion du changement d'image de profil dans le formulaire d'édition
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setEditForm(prev => ({
            ...prev,
            profileImage: event.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    };

     // Ouvrir le formulaire d'édition
  const handleEditClick = () => {
    setEditForm({...userData}); // Copier les données utilisateur actuelles dans le formulaire
    setIsEditing(true);
  };

  // Annuler les modifications
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Enregistrer les modifications
  const handleSaveEdit = () => {
    updateUserData(editForm);
    setIsEditing(false);
  };












  useEffect(() => {
    const storedTreeName = localStorage.getItem('treeName');
    const storedUserName = localStorage.getItem('userName');
    const storedGender = localStorage.getItem('gender');
    const storedBirthDate = localStorage.getItem('birthDate');
    const storedBirthPlace = localStorage.getItem('birthPlace');
    const storedProfileImage = localStorage.getItem('profileImage');
    
    updateUserData({
      treeName: storedTreeName || 'Famille Wotchoko',
      userName: storedUserName || 'Yohan Alex Wotchoko',
      gender: storedGender || 'masculin',
      birthDate: storedBirthDate || '2001',
      birthPlace: storedBirthPlace || '',
      profileImage: storedProfileImage || null
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userData={userData} />
      
      <div className="flex flex-1">
        <TreeSidebar 
          userData={userData} 
          updateUserData={updateUserData} 
          onEditClick={handleEditClick}
        />
        <TreeGraph 
          userData={userData} 
          updateUserData={updateUserData} 
        />
      </div>
    </div>
  );
}

function Header({ userData }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">{userData.treeName.toUpperCase()} Family tree</h1>
            <span className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {userData.userName}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-orange-200">
              <span>Vue famille</span>
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200">
              <FaSearch className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
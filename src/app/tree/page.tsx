'use client';
import { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaPlus, 
  FaSearch, 
  FaCamera, 
  FaEdit, 
  FaEllipsisH, 
  FaChevronDown, 
  FaChevronUp,
  FaArrowLeft
} from 'react-icons/fa';

export default function TreePage() {
  // États pour stocker les informations de l'utilisateur
  const [userData, setUserData] = useState({
    treeName: '',
    userName: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    profileImage: null
  });
  
  // État pour contrôler les sections expansibles
  const [expandedSections, setExpandedSections] = useState({
    family: false,
    events: true
  });

  // Toggle pour les sections expansibles
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Simuler la récupération des données du localStorage au chargement de la page
  useEffect(() => {
    // Dans une application réelle, vous récupéreriez ces données depuis une API ou le localStorage
    const storedTreeName = localStorage.getItem('treeName');
    const storedUserName = localStorage.getItem('userName');
    const storedGender = localStorage.getItem('gender');
    const storedBirthDate = localStorage.getItem('birthDate');
    const storedBirthPlace = localStorage.getItem('birthPlace');
    const storedProfileImage = localStorage.getItem('profileImage');
    
    setUserData({
      treeName: storedTreeName || 'Famille Wotchoko',
      userName: storedUserName || 'Yohan Wotchoko',
      gender: storedGender || 'masculin',
      birthDate: storedBirthDate || '2004',
      birthPlace: storedBirthPlace || 'Yaoundé',
      profileImage: storedProfileImage || null
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* En-tête élégant */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800 font-serif">{userData.treeName.toUpperCase()} Family Tree</h1>
              <div className="h-5 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">{userData.userName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm">
                <span>Vue famille</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all">
                <FaSearch className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all">
                <FaEllipsisH className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal - Disposition en deux colonnes */}
      <div className="flex flex-1">
        {/* Sidebar élégante */}
        <div className="w-72 bg-white border-r shadow-sm overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-inner transition-all duration-300 group-hover:shadow-md">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-all">
                  <FaCamera className="h-3 w-3 text-gray-500" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">{userData.userName}</h2>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    C'est vous
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{userData.birthDate} {userData.birthDate && userData.birthPlace ? '• ' : ''} {userData.birthPlace}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-orange-500 hover:text-orange-700 cursor-pointer flex items-center font-medium">
              <span>Rechercher cette personne</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Découvertes</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">i</span>
              </div>
              <div>
                <p className="text-sm text-blue-700">Une incohérence a été détectée dans votre arbre généalogique</p>
                <p className="text-xs text-blue-500 mt-1">Cliquez pour en savoir plus</p>
              </div>
            </div>
          </div> */}

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
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="text-sm font-medium text-gray-700">Aucun membre de famille ajouté</div>
                  <div className="text-xs text-gray-500 mt-1">Ajoutez des parents, des frères et sœurs, ou d'autres membres de la famille</div>
                </div>
              </div>
            )}
          </div>

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
                    <div className="w-12 text-sm font-medium text-gray-700">2004</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">Naissance</div>
                      <div className="text-xs text-gray-500">Yaoundé, Cameroun</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            <button className="block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all bg-white">
              Faire un test ADN
            </button>
            <button className="mt-3 block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all bg-white">
              Importer des données ADN
            </button>
          </div>
        </div>

        {/* Zone principale - Arbre généalogique */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Grille d'arrière-plan */}
          <div className="absolute inset-0 grid grid-cols-24 grid-rows-24 pointer-events-none opacity-10">
            {Array(24).fill().map((_, i) => (
              <div key={`col-${i}`} className="border-r border-gray-300 h-full"></div>
            ))}
            {Array(24).fill().map((_, i) => (
              <div key={`row-${i}`} className="border-b border-gray-300 w-full"></div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              {/* Parents potentiels */}
              <div className="flex justify-center mb-14 space-x-20">
                <div className="flex flex-col items-center">
                  <div className="w-44 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow group">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all">
                        <FaPlus className="text-gray-400 group-hover:text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500 group-hover:text-gray-600">Ajouter un père</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-44 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow group">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all">
                        <FaPlus className="text-gray-400 group-hover:text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500 group-hover:text-gray-600">Ajouter une mère</span>
                      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Lignes de connexion */}
              <div className="relative w-60 h-16">
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-300"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-16 w-px bg-gray-300"></div>
              </div>
              
              {/* Personne principale (vous) */}
              <div className="border-2 border-blue-500 rounded-xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-72 relative">
                <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-br-lg rounded-tl-lg">
                  Vous
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                    {userData.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-800">{userData.userName}</div>
                    <div className="text-sm text-gray-500">{userData.birthDate} • {userData.birthPlace}</div>
                  </div>
                  <button className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <FaEdit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Ligne de connexion descendante */}

              {/* <div className="h-16 w-px bg-gray-300 my-4"></div> */}
              
              {/* Zone pour les descendants */}
              {/* <div className="flex space-x-6">
                <button className="py-3 px-6 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <FaPlus className="h-4 w-4 text-gray-500" />
                  <span>Ajouter un enfant</span>
                </button>
                <button className="py-3 px-6 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <FaPlus className="h-4 w-4 text-gray-500" />
                  <span>Ajouter un conjoint</span>
                </button>
              </div> */}
            </div>
          </div>
          
          {/* Contrôles de navigation */}
          <div className="absolute left-6 bottom-6 flex space-x-2">
            <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
              <FaArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Contrôles de zoom */}
          <div className="absolute right-6 bottom-6 flex flex-col space-y-2 bg-white rounded-lg shadow-md p-2">
            <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="w-full h-px bg-gray-200"></div>
            <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Légende */}
          <div className="absolute left-6 top-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Légende</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Vous</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              <div className="h-3 w-3 rounded-full bg-gray-300"></div>
              <span>Non confirmé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
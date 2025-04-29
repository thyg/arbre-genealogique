'use client';
import { FaUser, FaPlus, FaEdit, FaTimes, FaSave, FaCamera } from 'react-icons/fa';
import { useState } from 'react';

export default function TreeGraph({ userData, updateUserData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    profileImage: userData.profileImage,
    userName: userData.userName,
    treeName: userData.treeName,
    gender: userData.gender,
    birthDate: userData.birthDate,
    birthPlace: userData.birthPlace
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      profileImage: userData.profileImage,
      userName: userData.userName,
      treeName: userData.treeName,
      gender: userData.gender,
      birthDate: userData.birthDate,
      birthPlace: userData.birthPlace
    });
  };

  const handleSaveEdit = () => {
    updateUserData(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm(prev => ({ ...prev, profileImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 relative overflow-hidden">
      {isEditing ? (
        <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50 z-10"> {/* bg-black */}
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Modifier le profil</h2>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {editForm.profileImage ? (
                      <img 
                        src={editForm.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom et Nom</label>
                  <input
                    type="text"
                    name="userName"
                    value={editForm.userName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    name="treeName"
                    value={editForm.treeName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="text"
                    name="birthDate"
                    value={editForm.birthDate}
                    onChange={handleInputChange}
                    placeholder="AAAA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={editForm.birthPlace}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center"
                >
                  <FaSave className="mr-2" /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-8 space-x-16">
            <div className="flex flex-col items-center">
              <button className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
                <FaPlus className="text-gray-400" />
                <span className="ml-2 text-sm text-gray-600 font-medium">Père</span>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <button className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
                <FaPlus className="text-gray-400" />
                <span className="ml-2 text-sm text-gray-600 font-medium">Mère</span>
              </button>
            </div>
          </div>
          
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
          
          <div className="border-2 border-blue-400 rounded-xl p-3 bg-white shadow-lg w-72 transition-all duration-200 hover:shadow-xl hover:border-blue-500">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{userData.userName}</div>
                <div className="text-xs text-gray-500">{userData.birthDate}</div>
              </div>
              <button 
                onClick={handleEditClick}
                className="ml-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
              >
                <FaEdit className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          
          <div className="mt-0">
            <button className="py-2 px-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center">
              <FaPlus className="mr-0" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute right-4 bottom-4 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
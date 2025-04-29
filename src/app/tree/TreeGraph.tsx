'use client';
import { FaUser, FaPlus, FaEdit, FaMinus, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import ProfileEditForm from './ProfileEditForm';

export default function TreeGraph({ userData, updateUserData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [familyMembers, setFamilyMembers] = useState({
    father: null,
    mother: null,
    siblings: [],
    children: [],
    spouse: null
  });
  const [newMember, setNewMember] = useState({
    id: '',
    profileImage: '',
    userName: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    relation: ''
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [editForm, setEditForm] = useState({
    profileImage: userData.profileImage,
    userName: userData.userName,
    treeName: userData.treeName,
    gender: userData.gender,
    birthDate: userData.birthDate,
    birthPlace: userData.birthPlace
  });

  // Load any existing family members on component mount
  useEffect(() => {
    if (userData.familyMembers) {
      setFamilyMembers(userData.familyMembers);
    }
  }, [userData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowAddMenu(false);
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
    updateUserData({...editForm, familyMembers});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
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

  const handleNewMemberImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewMember(prev => ({ ...prev, profileImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAddMenu = () => {
    setShowAddMenu(prev => !prev);
    setIsEditing(false);
  };

  const selectRelation = (relation) => {
    setSelectedRelation(relation);
    setShowAddForm(true);
    setShowAddMenu(false);
    
    // Initialize new member with relation
    setNewMember(prev => ({
      ...prev,
      id: `member-${Date.now()}`,
      relation: relation
    }));
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    
    const updatedFamilyMembers = {...familyMembers};
    
    switch(newMember.relation) {
      case 'father':
        updatedFamilyMembers.father = newMember;
        break;
      case 'mother':
        updatedFamilyMembers.mother = newMember;
        break;
      case 'sibling':
        updatedFamilyMembers.siblings = [...updatedFamilyMembers.siblings, newMember];
        break;
      case 'child':
        updatedFamilyMembers.children = [...updatedFamilyMembers.children, newMember];
        break;
      case 'spouse':
        updatedFamilyMembers.spouse = newMember;
        break;
      default:
        break;
    }
    
    setFamilyMembers(updatedFamilyMembers);
    updateUserData({...userData, familyMembers: updatedFamilyMembers});
    
    // Reset form
    setShowAddForm(false);
    setSelectedRelation(null);
    setNewMember({
      id: '',
      profileImage: '',
      userName: '',
      gender: '',
      birthDate: '',
      birthPlace: '',
      relation: ''
    });
  };

  const cancelAddMember = () => {
    setShowAddForm(false);
    setSelectedRelation(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 relative overflow-hidden">
      {isEditing ? (
        <ProfileEditForm
          editForm={editForm}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleCancelEdit={handleCancelEdit}
          handleSaveEdit={handleSaveEdit}
        />
      ) : null}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Ajouter {selectedRelation === 'father' ? 'le père' : 
                         selectedRelation === 'mother' ? 'la mère' : 
                         selectedRelation === 'sibling' ? 'un frère/une sœur' : 
                         selectedRelation === 'child' ? 'un enfant' : 'un(e) conjoint(e)'}
              </h3>
              <button 
                onClick={cancelAddMember}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md relative">
                    {newMember.profileImage ? (
                      <img 
                        src={newMember.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-8 w-8 text-gray-400" />
                    )}
                    <input 
                      type="file" 
                      id="newProfileImage" 
                      name="profileImage"
                      onChange={handleNewMemberImageChange}
                      className="opacity-0 absolute inset-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={newMember.userName}
                    onChange={handleNewMemberInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Genre</label>
                  <select
                    id="gender"
                    name="gender"
                    value={newMember.gender}
                    onChange={handleNewMemberInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={newMember.birthDate}
                    onChange={handleNewMemberInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                  <input
                    type="text"
                    id="birthPlace"
                    name="birthPlace"
                    value={newMember.birthPlace}
                    onChange={handleNewMemberInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelAddMember}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center overflow-auto">
        <div 
          className="relative"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Parents */}
          <div className="flex justify-center mb-8 space-x-16">
            <div className="flex flex-col items-center">
              {familyMembers.father ? (
                <div className="border-2 border-blue-400 rounded-xl p-3 bg-white shadow-lg w-40 transition-all duration-200 hover:shadow-xl hover:border-blue-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      {familyMembers.father.profileImage ? (
                        <img 
                          src={familyMembers.father.profileImage} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 truncate">{familyMembers.father.userName}</div>
                      <div className="text-xs text-gray-500">{familyMembers.father.birthDate}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => selectRelation('father')}
                  className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <FaPlus className="text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600 font-medium">Ajouter le père</span>
                </button>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              {familyMembers.mother ? (
                <div className="border-2 border-pink-400 rounded-xl p-3 bg-white shadow-lg w-40 transition-all duration-200 hover:shadow-xl hover:border-pink-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      {familyMembers.mother.profileImage ? (
                        <img 
                          src={familyMembers.mother.profileImage} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 truncate">{familyMembers.mother.userName}</div>
                      <div className="text-xs text-gray-500">{familyMembers.mother.birthDate}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => selectRelation('mother')}
                  className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <FaPlus className="text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600 font-medium">Ajouter la mère</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Connection line to central person */}
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent mx-auto"></div>
          
          {/* Main person and spouse */}
          <div className="flex justify-center space-x-6">
            {/* Siblings on the left */}
            {familyMembers.siblings.length > 0 && (
              <div className="flex flex-col items-center mr-6">
                <div className="flex flex-col space-y-3">
                  {familyMembers.siblings.map((sibling, index) => (
                    <div key={sibling.id} className="border-2 border-purple-300 rounded-xl p-2 bg-white shadow-md w-32 transition-all duration-200 hover:shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                          {sibling.profileImage ? (
                            <img 
                              src={sibling.profileImage} 
                              alt="Profile" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaUser className="h-3 w-3 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{sibling.userName}</div>
                          <div className="text-xxs text-gray-500">{sibling.birthDate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => selectRelation('sibling')}
                  className="mt-2 py-1 px-2 border border-gray-200 rounded-md bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <FaPlus className="mr-1 h-3 w-3" />
                  <span>Frère/Sœur</span>
                </button>
              </div>
            )}
            
            {/* Main person */}
            <div className="border-2 border-blue-500 rounded-xl p-3 bg-white shadow-lg w-56 transition-all duration-200 hover:shadow-xl">
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
                  <div className="text-xs text-gray-400">{userData.birthPlace}</div>
                </div>
                <button 
                  onClick={handleEditClick}
                  className="p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {/* Spouse */}
            {familyMembers.spouse ? (
              <div className="border-2 border-pink-300 rounded-xl p-3 bg-white shadow-md w-52 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    {familyMembers.spouse.profileImage ? (
                      <img 
                        src={familyMembers.spouse.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{familyMembers.spouse.userName}</div>
                    <div className="text-xs text-gray-500">{familyMembers.spouse.birthDate}</div>
                    <div className="text-xs text-gray-400">{familyMembers.spouse.birthPlace}</div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => selectRelation('spouse')}
                className="border-2 border-dashed border-gray-300 rounded-xl p-3 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center w-44"
              >
                <FaPlus className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 font-medium">Ajouter conjoint(e)</span>
              </button>
            )}
            
            {/* Add sibling button if no siblings yet */}
            {familyMembers.siblings.length === 0 && (
              <button 
                onClick={() => selectRelation('sibling')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full py-1.5 px-3 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200 flex items-center shadow-sm"
              >
                <FaPlus className="mr-1 h-3 w-3" />
                <span>Frère/Sœur</span>
              </button>
            )}
          </div>
          
          {/* Connection line to children */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-gray-300 mx-auto mt-1"></div>
          
          {/* Children */}
          <div className="flex justify-center mt-1">
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
              {familyMembers.children.map((child, index) => (
                <div key={child.id} className="border-2 border-green-300 rounded-xl p-2 bg-white shadow-md w-40 transition-all duration-200 hover:shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                      {child.profileImage ? (
                        <img 
                          src={child.profileImage} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{child.userName}</div>
                      <div className="text-xs text-gray-500">{child.birthDate}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => selectRelation('child')}
                className="h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md px-4"
              >
                <FaPlus className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 font-medium">Ajouter un enfant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom controls */}
      <div className="absolute right-4 bottom-4 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <button 
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <FaMinus className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {/* Add relation button */}
      <div className="absolute left-4 bottom-4">
        <button
          onClick={toggleAddMenu}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
        >
          <FaPlus className="h-5 w-5" />
        </button>
        
        {showAddMenu && (
          <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-48">
            <div className="text-sm font-medium text-gray-700 mb-2 px-2">Ajouter une relation</div>
            <button
              onClick={() => selectRelation('father')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center"
            >
              <FaUser className="mr-2 text-blue-500" /> Père
            </button>
            <button
              onClick={() => selectRelation('mother')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center"
            >
              <FaUser className="mr-2 text-pink-500" /> Mère
            </button>
            <button
              onClick={() => selectRelation('sibling')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center"
            >
              <FaUser className="mr-2 text-purple-500" /> Frère/Sœur
            </button>
            <button
              onClick={() => selectRelation('spouse')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center"
            >
              <FaUser className="mr-2 text-red-500" /> Conjoint(e)
            </button>
            <button
              onClick={() => selectRelation('child')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center"
            >
              <FaUser className="mr-2 text-green-500" /> Enfant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
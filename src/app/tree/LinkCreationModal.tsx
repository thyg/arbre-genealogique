'use client';
import { useState, useEffect } from 'react';
import { FaUser, FaCamera, FaTimes } from 'react-icons/fa';

export default function LinkCreationModal({ mode, sourcePerson, peopleDatabase, onClose, onSubmit }) {
  const [relationType, setRelationType] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [existingPersonId, setExistingPersonId] = useState('');
  const [useExistingPerson, setUseExistingPerson] = useState(false);
  const [existingPeopleOptions, setExistingPeopleOptions] = useState([]);

  useEffect(() => {
    // Filter out the source person and people already connected
    const options = Object.values(peopleDatabase).filter(person => {
      if (person.id === sourcePerson?.id) return false;
      if (sourcePerson) {
        if (sourcePerson.parents?.includes(person.id)) return false;
        if (sourcePerson.children?.includes(person.id)) return false;
        if (sourcePerson.partners?.includes(person.id)) return false;
      }
      return true;
    });
    setExistingPeopleOptions(options);
  }, [peopleDatabase, sourcePerson]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let targetData;
    if (useExistingPerson && existingPersonId) {
      const existingPerson = peopleDatabase[existingPersonId];
      targetData = {
        id: existingPerson.id,
        name: existingPerson.name,
        gender: existingPerson.gender,
        birthDate: existingPerson.birthDate,
        birthPlace: existingPerson.birthPlace,
        profileImage: existingPerson.profileImage
      };
    } else {
      targetData = {
        name,
        gender,
        birthDate,
        birthPlace,
        profileImage
      };
    }
    
    const sourceId = sourcePerson ? sourcePerson.id : '1'; // Default to main user if no source
    
    onSubmit(sourceId, targetData, relationType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === 'fromSelected' ? `Créer un lien depuis ${sourcePerson?.name.toUpperCase}` : 'Créer un nouveau lien familial'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de relation
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="parent">Parent</option>
              <option value="child">Enfant</option>
              <option value="partner">Conjoint(e)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {useExistingPerson ? 'Personne existante' : 'Nouvelle personne'}
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setUseExistingPerson(false)}
                className={`px-3 py-1 rounded-md text-sm ${!useExistingPerson ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Nouvelle
              </button>
              <button
                type="button"
                onClick={() => setUseExistingPerson(true)}
                disabled={existingPeopleOptions.length === 0}
                className={`px-3 py-1 rounded-md text-sm ${useExistingPerson ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} ${existingPeopleOptions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Existante ({existingPeopleOptions.length})
              </button>
            </div>
          </div>
          
          {useExistingPerson ? (
            <div>
              <select
                value={existingPersonId}
                onChange={(e) => setExistingPersonId(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionnez une personne</option>
                {existingPeopleOptions.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.gender === 'male' ? 'Homme' : 'Femme'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div 
                    className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
                    onClick={() => document.getElementById('profileImage').click()}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={!useExistingPerson}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required={!useExistingPerson}
                      />
                      <span className="ml-2 text-sm text-gray-700">Masculin</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Féminin</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Paris, France"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer le lien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
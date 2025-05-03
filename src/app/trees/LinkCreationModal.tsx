import { useState } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';

export default function LinkCreationModal({ mode, sourcePerson, peopleDatabase, onClose, onSubmit }) {
  const [existingPersonMode, setExistingPersonMode] = useState('existing');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [newPersonData, setNewPersonData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
    birthPlace: '',
    profileImage: ''
  });
  
  const handleExistingPersonSubmit = () => {
    if (!selectedPerson || !selectedRelation) {
      alert('Veuillez sélectionner une personne et une relation');
      return;
    }
    
    onSubmit(sourcePerson?.id || '1', { id: selectedPerson }, selectedRelation);
  };
  
  const handleNewPersonSubmit = () => {
    if (!newPersonData.name || !selectedRelation) {
      alert('Veuillez remplir au moins le nom et sélectionner une relation');
      return;
    }
    
    onSubmit(sourcePerson?.id || '1', newPersonData, selectedRelation);
  };
  
  const availablePeople = Object.values(peopleDatabase).filter(person => {
    if (sourcePerson && person.id === sourcePerson.id) return false;
    
    if (selectedRelation === 'parent') {
      if (sourcePerson && sourcePerson.parents.includes(person.id)) return false;
      if (sourcePerson && person.children.includes(sourcePerson.id)) return false;
    } else if (selectedRelation === 'child') {
      if (sourcePerson && sourcePerson.children.includes(person.id)) return false;
      if (sourcePerson && person.parents.includes(sourcePerson.id)) return false;
    } else if (selectedRelation === 'partner') {
      if (sourcePerson && sourcePerson.partners.includes(person.id)) return false;
    }
    
    return true;
  });
  
  return (
    <div className="absolute inset-0 bg-opacity-50 z-10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === 'fromSelected' ? `Ajouter une relation à ${sourcePerson?.name || 'cette personne'}` : 'Créer une nouvelle personne'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        {/* Relationship Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de relation
          </label>
          <select
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionnez une relation</option>
            <option value="parent">Parent</option>
            <option value="child">Enfant</option>
            <option value="partner">Conjoint(e)</option>
            <option value="sibling">Frère/Soeur</option>
            <option value="uncle">Oncle</option>
            <option value="aunt">Tante</option>
            <option value="nephew">Neveu</option>
            <option value="niece">Nièce</option>
            <option value="cousin">Cousin(e)</option>
            <option value="grandparent">Grand-parent</option>
            <option value="grandchild">Petit-enfant</option>
          </select>
        </div>
        
        {/* Person Selection Tabs */}
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium ${existingPersonMode === 'existing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setExistingPersonMode('existing')}
            >
              Personne existante
            </button>
            <button
              className={`py-2 px-4 font-medium ${existingPersonMode === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setExistingPersonMode('new')}
            >
              Nouvelle personne
            </button>
          </div>
          
          {/* Existing Person Selection */}
          {existingPersonMode === 'existing' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner une personne
              </label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choisir une personne</option>
                {availablePeople.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name || 'Sans nom'} {person.relationship ? `(${person.relationship})` : ''}
                  </option>
                ))}
              </select>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExistingPersonSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!selectedPerson || !selectedRelation}
                >
                  Créer la relation
                </button>
              </div>
            </div>
          )}
          
          {/* New Person Form */}
          {existingPersonMode === 'new' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newPersonData.name}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={newPersonData.gender}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="text"
                  placeholder="AAAA-MM-JJ"
                  value={newPersonData.birthDate}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={newPersonData.birthPlace}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setNewPersonData(prev => ({ ...prev, profileImage: e.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-sm text-gray-600"
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleNewPersonSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!newPersonData.name || !selectedRelation}
                >
                  Créer la personne
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
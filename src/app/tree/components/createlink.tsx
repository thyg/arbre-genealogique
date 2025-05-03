import React, { useState } from 'react';
import { createLink } from '../../lib/api';

interface CreateLinkProps {
  sourcePerson?: {
    id?: string;
    firstName: string;
    lastName: string;
  } | null;
  onLinkCreated: () => void;
  onClose: () => void;
}

const relationTypeOptions = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'CHILD', label: 'Enfant' },
  { value: 'SPOUSE', label: 'Conjoint(e)' },
  { value: 'SIBLING', label: 'Frère/Soeur' },
  { value: 'FATHER', label: 'Père' },
  { value: 'MOTHER', label: 'Mère' },
  { value: 'SON', label: 'Fils' },
  { value: 'DAUGHTER', label: 'Fille' },
  { value: 'HUSBAND', label: 'Mari' },
  { value: 'WIFE', label: 'Épouse' },
  { value: 'BROTHER', label: 'Frère' },
  { value: 'SISTER', label: 'Soeur' },
  { value: 'UNCLE', label: 'Oncle' },
  { value: 'AUNT', label: 'Tante' },
  { value: 'NEPHEW', label: 'Neveu' },
  { value: 'NIECE', label: 'Nièce' },
  { value: 'COUSIN', label: 'Cousin(e)' },
  { value: 'GRANDFATHER', label: 'Grand-père' },
  { value: 'GRANDMOTHER', label: 'Grand-mère' },
  { value: 'GRANDSON', label: 'Petit-fils' },
  { value: 'GRANDDAUGHTER', label: 'Petite-fille' },
];

const genderOptions = [
  { value: 'MALE', label: 'Homme' },
  { value: 'FEMALE', label: 'Femme' },
  { value: '', label: 'Non spécifié' },
];

const CreateLinkModal: React.FC<CreateLinkProps> = ({
  sourcePerson = null,
  onLinkCreated,
  onClose
}) => {
  const [relationType, setRelationType] = useState('');
  const [sourceData, setSourceData] = useState({
    id: sourcePerson?.id || '',
    firstName: sourcePerson?.firstName || '',
    lastName: sourcePerson?.lastName || '',
    birthDate: '',
    birthPlace: '',
    gender: '',
  });
  const [targetData, setTargetData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
  });
  const [useExistingSource, setUseExistingSource] = useState(!!sourcePerson);
  const [useExistingTarget, setUseExistingTarget] = useState(false);
  const [existingSourceId, setExistingSourceId] = useState(sourcePerson?.id || '');
  const [existingTargetId, setExistingTargetId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion des changements dans le formulaire
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSourceData(prev => ({ ...prev, [name]: value }));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTargetData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      // Préparez les données pour l'API
      const payload = {
        relationType,
        familyTreeId: '1', // À remplacer par l'ID de l'arbre actuel
        source: useExistingSource 
          ? { id: existingSourceId } 
          : sourceData,
        target: useExistingTarget 
          ? { id: existingTargetId } 
          : targetData
      };

      // Validation des données
      if (!relationType) {
        throw new Error('Le type de relation est obligatoire');
      }
      
      if (useExistingSource && !existingSourceId) {
        throw new Error('L\'ID de la source est obligatoire');
      }
      
      if (!useExistingSource && (!sourceData.firstName || !sourceData.lastName)) {
        throw new Error('Le prénom et le nom de la source sont obligatoires');
      }
      
      if (useExistingTarget && !existingTargetId) {
        throw new Error('L\'ID de la cible est obligatoire');
      }
      
      if (!useExistingTarget && (!targetData.firstName || !targetData.lastName)) {
        throw new Error('Le prénom et le nom de la cible sont obligatoires');
      }

      // Appel API pour créer le lien
      await createLink(payload);
      onLinkCreated();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création du lien:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Créer un lien familial</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Type de relation */}
          <div className="mb-6">
            <label htmlFor="relationType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de relation
            </label>
            <select
              id="relationType"
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez un type de relation</option>
              {relationTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne de gauche: Source */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-md font-medium mb-3">Personne source</h4>
              
              {/* Option pour utiliser une personne existante ou créer une nouvelle */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="source-existing"
                    name="source-type"
                    checked={useExistingSource}
                    onChange={() => setUseExistingSource(true)}
                    className="mr-2"
                  />
                  <label htmlFor="source-existing" className="text-sm">
                    Personne existante
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="source-new"
                    name="source-type"
                    checked={!useExistingSource}
                    onChange={() => setUseExistingSource(false)}
                    className="mr-2"
                  />
                  <label htmlFor="source-new" className="text-sm">
                    Nouvelle personne
                  </label>
                </div>
              </div>

              {useExistingSource ? (
                <div className="mb-4">
                  <label htmlFor="existingSourceId" className="block text-sm font-medium text-gray-700 mb-1">
                    ID de la personne
                  </label>
                  <input
                    type="text"
                    id="existingSourceId"
                    value={existingSourceId}
                    onChange={(e) => setExistingSourceId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={useExistingSource}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="source-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="source-firstName"
                      name="firstName"
                      value={sourceData.firstName}
                      onChange={handleSourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!useExistingSource}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="source-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="source-lastName"
                      name="lastName"
                      value={sourceData.lastName}
                      onChange={handleSourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!useExistingSource}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="source-gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <select
                      id="source-gender"
                      name="gender"
                      value={sourceData.gender}
                      onChange={handleSourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="source-birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="source-birthDate"
                      name="birthDate"
                      value={sourceData.birthDate}
                      onChange={handleSourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="source-birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      id="source-birthPlace"
                      name="birthPlace"
                      value={sourceData.birthPlace}
                      onChange={handleSourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Colonne de droite: Cible */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-md font-medium mb-3">Personne cible</h4>
              
              {/* Option pour utiliser une personne existante ou créer une nouvelle */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="target-existing"
                    name="target-type"
                    checked={useExistingTarget}
                    onChange={() => setUseExistingTarget(true)}
                    className="mr-2"
                  />
                  <label htmlFor="target-existing" className="text-sm">
                    Personne existante
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="target-new"
                    name="target-type"
                    checked={!useExistingTarget}
                    onChange={() => setUseExistingTarget(false)}
                    className="mr-2"
                  />
                  <label htmlFor="target-new" className="text-sm">
                    Nouvelle personne
                  </label>
                </div>
              </div>

              {useExistingTarget ? (
                <div className="mb-4">
                  <label htmlFor="existingTargetId" className="block text-sm font-medium text-gray-700 mb-1">
                    ID de la personne
                  </label>
                  <input
                    type="text"
                    id="existingTargetId"
                    value={existingTargetId}
                    onChange={(e) => setExistingTargetId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={useExistingTarget}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="target-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="target-firstName"
                      name="firstName"
                      value={targetData.firstName}
                      onChange={handleTargetChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!useExistingTarget}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="target-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="target-lastName"
                      name="lastName"
                      value={targetData.lastName}
                      onChange={handleTargetChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!useExistingTarget}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="target-gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <select
                      id="target-gender"
                      name="gender"
                      value={targetData.gender}
                      onChange={handleTargetChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="target-birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="target-birthDate"
                      name="birthDate"
                      value={targetData.birthDate}
                      onChange={handleTargetChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="target-birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      id="target-birthPlace"
                      name="birthPlace"
                      value={targetData.birthPlace}
                      onChange={handleTargetChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isCreating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isCreating ? 'Création en cours...' : 'Créer le lien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Bouton flottant qui ouvre le modal
export const CreateLinkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Créer un lien"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </button>
  );
};

export default CreateLinkModal;
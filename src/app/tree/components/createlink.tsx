import React, { useState } from 'react';
import { Person } from '../types/person';

interface CreateLinkProps {
  sourcePerson: Person;
  targetPerson: Person;
  onClose: () => void;
  onLinkCreated: () => void;
  treeId: number;
}

const relationTypes = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'CHILD', label: 'Enfant' },
  { value: 'SPOUSE', label: 'Conjoint(e)' },
  { value: 'SIBLING', label: 'Frère/Sœur' },
  { value: 'COUSIN', label: 'Cousin(e)' },
  { value: 'UNCLE', label: 'Oncle' },
  { value: 'AUNT', label: 'Tante' },
  { value: 'NEPHEW', label: 'Neveu' },
  { value: 'NIECE', label: 'Nièce' },
  { value: 'GRANDPARENT', label: 'Grand-parent' },
  { value: 'GRANDCHILD', label: 'Petit-enfant' },
];

const CreateLink: React.FC<CreateLinkProps> = ({ 
  sourcePerson, 
  targetPerson, 
  onClose, 
  onLinkCreated,
  treeId
}) => {
  const [relationType, setRelationType] = useState('PARENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create link to existing person
      const payload = {
        relationType,
        id_source: sourcePerson.id,
        id_target: targetPerson.id,
        familyTreeId: treeId
      };

      const response = await fetch('http://localhost:8030/api/family-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      onLinkCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">Créer une relation</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">
            Création d'une relation entre <strong>{sourcePerson.firstName} {sourcePerson.lastName}</strong> et <strong>{targetPerson.firstName} {targetPerson.lastName}</strong>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Type de relation
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              {relationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {sourcePerson.firstName} {sourcePerson.lastName} est le {relationTypes.find(t => t.value === relationType)?.label.toLowerCase()} de {targetPerson.firstName} {targetPerson.lastName}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLink;
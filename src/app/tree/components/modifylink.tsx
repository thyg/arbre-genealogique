'use client';

import { useState } from 'react';
import { FamilyLink, RelationType } from '../types/person';

interface ModifyLinkProps {
  link: FamilyLink;
  onUpdate: (updatedLink: FamilyLink) => void;
  onCancel: () => void;
}

const relationTypes: RelationType[] = [
  'FATHER', 'MOTHER', 'SON', 'DAUGHTER', 
  'BROTHER', 'SISTER', 'HUSBAND', 'WIFE', 
  'GRANDFATHER', 'GRANDMOTHER', 'GRANDSON', 'GRANDDAUGHTER',
  'UNCLE', 'AUNT', 'NEPHEW', 'NIECE', 'COUSIN'
];

export default function ModifyLink({ link, onUpdate, onCancel }: ModifyLinkProps) {
  const [relationType, setRelationType] = useState<RelationType>(link.relationType);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8030/api/family-link/${link.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationType
        }),
      });
      
      const result = await response.json();
      
      if (result.text === "200") {
        onUpdate({
          ...link,
          relationType: result.data.relationType
        });
      } else {
        setError('Failed to update the link');
      }
    } catch (err) {
      setError('An error occurred while updating the link');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Modifier le lien</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="relationType" className="block text-sm font-medium text-gray-700 mb-1">
            Type de relation
          </label>
          <select
            id="relationType"
            value={relationType}
            onChange={(e) => setRelationType(e.target.value as RelationType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {relationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isUpdating}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}
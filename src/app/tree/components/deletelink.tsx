'use client';

import { useState } from 'react';
import { FamilyLink } from '../types/person';

interface DeleteLinkProps {
  link: FamilyLink;
  onDelete: (linkId: number) => void;
  onCancel: () => void;
}

export default function DeleteLink({ link, onDelete, onCancel }: DeleteLinkProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8030/api/family-link/${link.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.value === "204") {
        onDelete(link.id);
      } else {
        setError(result.text || 'Failed to delete link');
      }
    } catch (err) {
      setError('An error occurred while deleting the link');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Supprimer le lien</h3>
      <p className="text-sm text-gray-600 mb-4">
        Êtes-vous sûr de vouloir supprimer ce lien de type{' '}
        <span className="font-bold">{link.relationType}</span> ?
      </p>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          disabled={isDeleting}
        >
          Annuler
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Person } from '../types/person';

interface SupprimerPersonneProps {
  person: Person;
  onDelete: (personId: number) => void;
  onCancel: () => void;
}

export default function SupprimerPersonne({ person, onDelete, onCancel }: SupprimerPersonneProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8030/api/persons/${person.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onDelete(person.id);
      } else {
        const errorData = await response.json();
        setError(errorData.text || 'Failed to delete person');
      }
    } catch (err) {
      setError('An error occurred while deleting the person');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Supprimer la personne</h2>
      
      <div className="bg-yellow-50 p-4 rounded-md mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Vous êtes sur le point de supprimer {person.firstName} {person.lastName} de l'arbre généalogique.
                Cette action est irréversible et supprimera également tous les liens associés à cette personne.
              </p>
            </div>
          </div>
        </div>
      </div>
      
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
          {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
        </button>
      </div>
    </div>
  );
}
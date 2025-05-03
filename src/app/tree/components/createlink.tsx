// src/app/tree/components/CreateLinkModal.tsx
'use client';

import React, { useState } from 'react';
import {
  createLink,
  type CreateRelationWithPersonsPayload,
  type PersonData,
} from '../../lib/api';
import { PersonForm } from './personForm';
import {Person} from '../types/person';
export interface CreateLinkModalProps {
  /** L’ID de l’arbre courant */
  familyTreeId: string;
  /** Callback après création réussie */
  sourcePerson?: Person | null;
  onLinkCreated: () => void;
  /** Ferme le modal */
  onClose: () => void;
}
const relationTypeOptions = [
  { value: 'FATHER',        label: 'Père' },
  { value: 'MOTHER',        label: 'Mère' },
  { value: 'SON',           label: 'Fils' },
  { value: 'DAUGHTER',      label: 'Fille' },
  { value: 'BROTHER',       label: 'Frère' },
  { value: 'SISTER',        label: 'Sœur' },
  { value: 'HUSBAND',       label: 'Mari' },
  { value: 'WIFE',          label: 'Épouse' },
  { value: 'GRANDFATHER',   label: 'Grand-père' },
  { value: 'GRANDMOTHER',   label: 'Grand-mère' },
  { value: 'GRANDSON',      label: 'Petit-fils' },
  { value: 'GRANDDAUGHTER', label: 'Petite-fille' },
  { value: 'UNCLE',         label: 'Oncle' },
  { value: 'AUNT',          label: 'Tante' },
  { value: 'NEPHEW',        label: 'Neveu' },
  { value: 'NIECE',         label: 'Nièce' },
  { value: 'COUSIN',        label: 'Cousin(e)' },
];

const genderOptions = [
  { value: 'MALE',   label: 'Homme' },
  { value: 'FEMALE', label: 'Femme' },
  { value: '',       label: 'Non spécifié' },
];

export default function CreateLinkModal({
  familyTreeId,
  onLinkCreated,
  onClose,
}: CreateLinkModalProps) {
  const [relationType, setRelationType] = useState<string>('');
  const [sourceData, setSourceData]     = useState<PersonData>({
    firstName:  '',
    lastName:   '',
    birthDate:  undefined,
    birthPlace: undefined,
    gender:     undefined,
  });
  const [targetData, setTargetData]     = useState<PersonData>({
    firstName:  '',
    lastName:   '',
    birthDate:  undefined,
    birthPlace: undefined,
    gender:     undefined,
  });
  const [isCreating, setIsCreating]     = useState<boolean>(false);
  const [error, setError]               = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validations minimales
    if (!relationType) {
      setError('Le type de relation est obligatoire');
      return;
    }
    if (!sourceData.firstName || !sourceData.lastName) {
      setError('Prénom et nom de la source sont obligatoires');
      return;
    }
    if (!targetData.firstName || !targetData.lastName) {
      setError('Prénom et nom de la cible sont obligatoires');
      return;
    }

    setIsCreating(true);
    try {
      const payload: CreateRelationWithPersonsPayload = {
        familyTreeId: Number(familyTreeId),
        relationType,
        source:  {
          firstName: sourceData.firstName,
          lastName:  sourceData.lastName,
          ...(sourceData.birthDate  && { birthDate:  sourceData.birthDate  }),
          ...(sourceData.birthPlace && { birthPlace: sourceData.birthPlace }),
          ...(sourceData.gender     && { gender:     sourceData.gender     }),
        },
        target:  {
          firstName: targetData.firstName,
          lastName:  targetData.lastName,
          ...(targetData.birthDate  && { birthDate:  targetData.birthDate  }),
          ...(targetData.birthPlace && { birthPlace: targetData.birthPlace }),
          ...(targetData.gender     && { gender:     targetData.gender     }),
        },
      };

      await createLink(payload);
      onLinkCreated();
      onClose();
    } catch (err: unknown) {
      console.error('Erreur lors de la création du lien :', err);
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium">Créer un lien familial</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            title="Fermer"
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Sélection du type de relation */}
          <div>
            <label
              htmlFor="relationType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type de relation
            </label>
            <select
              id="relationType"
              value={relationType}
              onChange={e => setRelationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez…</option>
              {relationTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Formulaires pour Source & Cible */}
          <div className="grid md:grid-cols-2 gap-6">
            <PersonForm
              title="Personne source"
              data={sourceData}
              onChange={(field, val) =>
                setSourceData(prev => ({ ...prev, [field]: val }))
              }
              genderOptions={genderOptions}
            />

            <PersonForm
              title="Personne cible"
              data={targetData}
              onChange={(field, val) =>
                setTargetData(prev => ({ ...prev, [field]: val }))
              }
              genderOptions={genderOptions}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${
                isCreating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isCreating ? 'Création en cours…' : 'Créer le lien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const CreateLinkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="Créer un lien"
    title="Créer un lien"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  </button>
);

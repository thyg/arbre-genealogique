// src/app/tree/components/PersonForm.tsx
//ceci est le code pour le formulaire des personnes 
'use client';

import React, { useEffect, useState } from 'react';
import { MemberSelect, MemberOption } from './components/MemberSelect';
import { getTreeMembers } from '../../lib/api';
import type { PersonData } from '../../lib/api';

export interface PersonFormProps {
  /** Titre (« Personne source » ou « Personne cible ») */
  title: string;
  /** ID de l’arbre pour charger ses membres */
  treeId: string;
  /** Mode : true = sélectionner un existant, false = créer nouveau */
  useExisting: boolean;
  /** Bascule existant / nouveau */
  onToggleMode: (useExisting: boolean) => void;
  /** Valeur sélectionnée si useExisting = true */
  existingValue: MemberOption | null;
  /** Callback à la sélection d’un membre existant */
  onExistingChange: (member: MemberOption | null) => void;
  /** Données du formulaire si on crée une personne */
  data: PersonData;
  /** Callback pour mise à jour d’un champ (field, valeur) */
  onChange: (field: keyof PersonData, value: string) => void;
  /** Liste des options de genre */
  genderOptions: { value: string; label: string }[];
}

export function PersonForm({
  title,
  treeId,
  useExisting,
  onToggleMode,
  existingValue,
  onExistingChange,
  data,
  onChange,
  genderOptions,
}: PersonFormProps) {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dès qu’on passe en mode existant, on charge les membres
  useEffect(() => {
    if (!useExisting) return;
    setLoading(true);
    getTreeMembers(treeId)
      .then(setMembers)
      .catch(() => setError('Impossible de charger les membres'))
      .finally(() => setLoading(false));
  }, [treeId, useExisting]);

  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h4 className="text-md font-medium mb-2">{title}</h4>

      {/* Choix existant / nouveau */}
      <div className="flex items-center space-x-6 mb-4">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={useExisting}
            onChange={() => onToggleMode(true)}
            className="mr-1"
          />
          <span className="text-sm">Existant</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={!useExisting}
            onChange={() => onToggleMode(false)}
            className="mr-1"
          />
          <span className="text-sm">Nouveau</span>
        </label>
      </div>

      {useExisting ? (
        <>
          {loading && <p>Chargement…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <MemberSelect
              label={title}
              options={members}
              value={existingValue}
              onChange={onExistingChange}
            />
          )}
        </>
      ) : (
        <>
          {/* Prénom */}
          <div>
            <label htmlFor={`${title}-firstName`} className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              id={`${title}-firstName`}
              type="text"
              value={data.firstName}
              onChange={e => onChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label htmlFor={`${title}-lastName`} className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              id={`${title}-lastName`}
              type="text"
              value={data.lastName}
              onChange={e => onChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor={`${title}-gender`} className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              id={`${title}-gender`}
              value={data.gender || ''}
              onChange={e => onChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">–</option>
              {genderOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date de naissance */}
          <div>
            <label htmlFor={`${title}-birthDate`} className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance
            </label>
            <input
              id={`${title}-birthDate`}
              type="date"
              value={data.birthDate || ''}
              onChange={e => onChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Lieu de naissance */}
          <div>
            <label htmlFor={`${title}-birthPlace`} className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance
            </label>
            <input
              id={`${title}-birthPlace`}
              type="text"
              value={data.birthPlace || ''}
              onChange={e => onChange('birthPlace', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
}

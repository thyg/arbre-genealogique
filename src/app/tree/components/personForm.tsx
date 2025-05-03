// src/app/tree/components/PersonForm.tsx
'use client';

import React from 'react';
import type { PersonData } from '../../lib/api';

export interface PersonFormProps {
  /** Titre à afficher (ex: "Personne source" ou "Personne cible") */
  title: string;
  /** Données pour création / édition d'une personne */
  data: PersonData;
  /** Fonction de mise à jour d'un champ (field, nouvelle valeur) */
  onChange: (field: keyof PersonData, value: string) => void;
  /** Options de sélection du genre */
  genderOptions: { value: string; label: string }[];
}

export function PersonForm({
  title,
  data,
  onChange,
  genderOptions,
}: PersonFormProps) {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h4 className="text-md font-medium mb-2">{title}</h4>

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
          {genderOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

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
    </div>
  );
}

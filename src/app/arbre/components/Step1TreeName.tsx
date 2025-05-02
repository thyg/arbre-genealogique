'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export interface Step1Values {
  name: string;
  creator: string;
  description: string;
  geographicOrigin: string;
}

interface Step1TreeNameProps {
  values: Step1Values;
  onChange: (field: keyof Step1Values, value: string) => void;
  onNext: () => void;
}

export default function Step1TreeName({
  values,
  onChange,
  onNext,
}: Step1TreeNameProps) {
  const { name, creator, description, geographicOrigin } = values;
  const isValid =
    name.trim() !== '' &&
    creator.trim() !== '' &&
    geographicOrigin.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Nom de l'arbre */}
      <div>
        <label htmlFor="tree-name" className="block text-sm font-medium text-gray-700">
          Nom de votre arbre généalogique
        </label>
        <input
          type="text"
          id="tree-name"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex : Famille Dupont"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Créateur */}
      <div>
        <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
          Votre nom complet (créateur)
        </label>
        <input
          type="text"
          id="creator"
          value={creator}
          onChange={(e) => onChange('creator', e.target.value)}
          placeholder="Ex : Jean Dupont"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Description (optionnel) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Une courte description de l'arbre"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      {/* Origine géographique */}
      <div>
        <label htmlFor="geographic-origin" className="block text-sm font-medium text-gray-700">
          Origine géographique
        </label>
        <input
          type="text"
          id="geographic-origin"
          value={geographicOrigin}
          onChange={(e) => onChange('geographicOrigin', e.target.value)}
          placeholder="Ex : Cameroun"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Bouton Continuer */}
      <button
        onClick={onNext}
        disabled={!isValid}
        className={`
          w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-md
          ${isValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
        aria-label="Créer l'arbre"
        title="Créer l'arbre"
      >
        Créer larbre <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}

// src/app/tree/components/PersonNode.tsx
'use client';

import React from 'react';
import type { Person, FamilyLink } from '../types/person';

export interface PersonNodeProps {
  /** Données de la personne (déjà chargées en amont) */
  person: Person;
  /** Si on veut surligner ce noeud (chemin, sélection…) */
  highlighted?: boolean;
  /** Clic gauche sur le noeud */
  onClick?: (person: Person) => void;
  /** Clic droit (context menu) sur le noeud */
  onContextMenu?: (person: Person) => void;
  /** (Optionnel) position x/y pour un rendu React + <foreignObject> si vous préférez */
  x?: number;
  y?: number;
}

/**
 * Calcule l'âge à partir d'une date ISO.
 */
function computeAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const bd = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return age;
}

export default function PersonNode({
  person,
  highlighted = false,
  onClick,
  onContextMenu,
  x,
  y,
}: PersonNodeProps) {
  const age = computeAge(person.birthDate);
  const strokeColor = highlighted ? '#fbbf24' : (person.gender === 'MALE' ? '#93c5fd' : '#f9a8d4');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(person);
  };
  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(person);
  };

  // Si on utilise D3 + direct DOM, on ignorera x/y et on appellera ce composant dans un <foreignObject>.
  // Ici on fait un rendu React "absolu" si x/y sont fournis.
  const style: React.CSSProperties = (typeof x === 'number' && typeof y === 'number')
    ? { position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }
    : {};

  return (
    <div
      className={`p-2 bg-white rounded-lg shadow-md text-center`}
      style={style}
      onClick={handleClick}
      onContextMenu={handleContext}
      role="button"
      aria-label={`Personne ${person.firstName} ${person.lastName}`}
    >
      {/* Cercle + avatar */}
      <div
        className="mx-auto rounded-full flex items-center justify-center mb-2"
        style={{
          width: 60, height: 60,
          border: `3px solid ${strokeColor}`,
          background: highlighted ? '#fffbeb' : '#fff'
        }}
      >
        {person.gender === 'MALE' ? '👨' : '👩'}
      </div>

      {/* Nom et âge */}
      <h4 className="text-sm font-semibold text-gray-800">
        {person.firstName} {person.lastName}
      </h4>
      {age != null && (
        <p className="text-xs text-gray-500">{age} ans</p>
      )}

      {/* Détails facultatifs */}
      <div className="mt-1 text-xs text-gray-600 space-y-1">
        {person.birthDate && (
          <div>
            <span className="font-medium">Né·e :</span>{' '}
            {new Date(person.birthDate).toLocaleDateString()}
          </div>
        )}
        {person.birthPlace && (
          <div>
            <span className="font-medium">Lieu :</span>{' '}
            {person.birthPlace}
          </div>
        )}
      </div>

      {/* Relations sortantes */}
      {person.outgoingLinks && person.outgoingLinks.length > 0 && (
  <ul className="mt-2 text-xs text-gray-600 space-y-0.5">
    {person.outgoingLinks.map(link => {
      const target = link.target!;
      return (
        <li key={link.id} className="flex items-center justify-center">
          <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1" />
          <strong className="uppercase">{link.relationType.toLowerCase()}</strong> :{' '}
          {target.firstName} {target.lastName}
        </li>
      );
    })}
  </ul>
)}
    </div>
  );
}

//composant pour pouvoir choisir les membres d'un arbre a partir de l'id de l'arbre

"use client";

import React from 'react';

// Type for each member option
export interface MemberOption {
  id: string;
  userName: string;
}

interface MemberSelectProps {
  label: string;
  options: MemberOption[];
  value: MemberOption | null;
  onChange: (member: MemberOption | null) => void;
}

export function MemberSelect({ label, options, value, onChange }: MemberSelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        aria-label={label}
        value={value?.id || ''}
        onChange={e => {
          const selected = options.find(opt => opt.id === e.target.value) || null;
          onChange(selected);
        }}
        className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="" disabled>
          -- Choisir --
        </option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.userName}
          </option>
        ))}
      </select>
    </div>
  );
}

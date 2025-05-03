// src/app/tree/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Recherche from './recherche';
import { getTree } from '../../lib/api';  // <-- à créer

interface NavbarProps {
  treeId: number;
  refreshTree: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ treeId, refreshTree }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // valeurs dynamiques
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // charger le nom de l'arbre et son créateur
    async function fetchTreeDetails() {
      try {
        const tree = await getTree(String(treeId));
        setFamilyName(tree.name);
        setUsername(tree.creator);
      } catch (err) {
        console.error('Impossible de récupérer les infos de l’arbre', err);
      }
    }
    fetchTreeDetails();
  }, [treeId]);

  return (
    <div className="bg-white border-b border-gray-300 p-3">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left section */}
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-gray-700">
            {familyName || '—'}
          </h1>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-sm text-gray-500">
            {username || '—'}
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            aria-label="Rechercher une personne"
            title="Rechercher une personne"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher…
          </button>

          <button
            className="flex items-center text-sm text-orange-500 hover:text-orange-600"
            aria-label="Vue famille"
            title="Vue famille"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Famille
          </button>

          {/* Icônes seules : on ajoute aria-label/title */}
          <button
            aria-label="Partager"
            title="Partager"
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684
                   a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316
                   m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684
                   zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684" />
            </svg>
          </button>

          <button
            aria-label="Notifications"
            title="Notifications"
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999
                   5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </button>

          <button
            aria-label="Paramètres"
            title="Paramètres"
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0
                   a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37
                   a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35
                   a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37
                   a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0
                   a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37
                   a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35
                   a1.724 1.724 0 001.066-2.573
                   c-.94-1.543.826-3.31 2.37-2.37zM15 12
                   a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Popup Recherche */}
      {isSearchOpen && (
        <Recherche
          treeId={treeId}
          onClose={() => setIsSearchOpen(false)}
          refreshTree={refreshTree}
        />
      )}
    </div>
  );
};

export default Navbar;

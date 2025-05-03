'use client';

import React, { useState, useEffect } from 'react';
import Recherche from './recherche';
import { getTree } from '../../lib/api';

interface NavbarProps {
  treeId: string;           // on passe treeId en string pour next/router
  refreshTree: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ treeId, refreshTree }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // valeurs dynamiques
  const [familyName, setFamilyName] = useState<string>('');
  const [creatorName, setCreatorName] = useState<string>('');

  useEffect(() => {
    async function fetchTreeDetails() {
      try {
        const tree = await getTree(treeId);
        setFamilyName(tree.name);
        setCreatorName(tree.creator);
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
        <div className="flex items-baseline space-x-2">
          <h1 className="text-lg font-medium text-gray-700">
            {familyName || '—'}
          </h1>
          <span className="text-sm text-gray-500">
            Créé par {creatorName || '—'}
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
            🔍 Rechercher
          </button>

          <button
            onClick={refreshTree}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:underline"
            aria-label="Rafraîchir l’arbre"
            title="Rafraîchir l’arbre"
          >
            ↻ Rafraîchir
          </button>

          {/* Icônes seules : on ajoute aria-label + title */}
          <button
            aria-label="Vue famille"
            title="Vue famille"
            className="flex items-center text-sm text-orange-500 hover:text-orange-600"
          >
            👪 Famille
          </button>
          <button
            aria-label="Partager"
            title="Partager"
            className="text-gray-600 hover:text-gray-800"
          >
            🔗
          </button>
          <button
            aria-label="Notifications"
            title="Notifications"
            className="text-gray-600 hover:text-gray-800"
          >
            🔔
          </button>
          <button
            aria-label="Paramètres"
            title="Paramètres"
            className="text-gray-600 hover:text-gray-800"
          >
            ⚙️
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

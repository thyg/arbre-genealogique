// src/app/tree/[treeId]/components/recherche.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getTreeMembers, getRelationship } from '@/app/lib/api';
import { MemberSelect } from '../components/components/MemberSelect';
import { RelationshipPath, RelationshipStep } from '../components/components/RelationshipPath';

interface Member {
  id: string;
  userName: string;
}

/** Props que tu passes depuis Navbar */
export interface RechercheProps {
  treeId: string;
  onClose: () => void;
  refreshTree: () => void;
}

export default function Recherche({
  treeId,
  onClose,
  refreshTree,
}: RechercheProps) {
  const [members, setMembers]         = useState<Member[]>([]);
  const [personA, setPersonA]         = useState<Member | null>(null);
  const [personB, setPersonB]         = useState<Member | null>(null);
  const [path, setPath]               = useState<RelationshipStep[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [loading, setLoading]         = useState<boolean>(false);
  const [error, setError]             = useState<string | null>(null);
  const [isSuccess, setIsSuccess]     = useState<boolean>(false);

  // 1) Charger les membres dès que treeId change
  useEffect(() => {
    if (!treeId) return;
    setLoading(true);
    getTreeMembers(treeId)
      .then(data => setMembers(data))
      .catch(() => setError("Impossible de charger les membres."))
      .finally(() => setLoading(false));
  }, [treeId]);

  // 2) Recherche du chemin
  const handleSearch = async () => {
    if (!personA || !personB) {
      setError("Veuillez sélectionner deux personnes.");
      return;
    }
    if (personA.id === personB.id) {
      setError("Veuillez sélectionner deux personnes différentes.");
      return;
    }

    setLoading(true);
    setError(null);
    setPath([]);
    setIsSuccess(false);

    try {
      const res = await getRelationship(personA.id, personB.id, treeId);
      if (res.path.length > 0) {
        setPath(res.path);
        setTotalWeight(res.totalWeight);
        setIsSuccess(true);
      } else {
        setError("Aucun lien familial trouvé.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-gray-100">
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Recherche de lien familial</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-5 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Personne A
            </label>
            <div className="relative">
              <MemberSelect 
                options={members} 
                value={personA} 
                onChange={setPersonA} 
                label="" 
                
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Personne B
            </label>
            <div className="relative">
              <MemberSelect 
                options={members} 
                value={personB} 
                onChange={setPersonB} 
                label="" 
                 
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !personA || !personB}
          className="w-full py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center font-medium shadow-md transition-all duration-200 transform hover:translate-y-px"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recherche…
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Trouver le lien
            </div>
          )}
        </button>

        {isSuccess && path.length > 0 && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="mb-2 text-blue-700 font-medium flex items-center">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Résultat trouvé
              </div>
              <RelationshipPath path={path} totalWeight={totalWeight} />
            </div>

            <button
              onClick={refreshTree}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center w-full py-2.5 hover:bg-blue-50 rounded-xl transition-colors duration-200 border border-blue-100 hover:border-blue-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Rafraîchir larbre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { getTreeMembers, getRelationship } from "../lib/api";
import { MemberSelect } from "./components/MemberSelect";
import { RelationshipPath, RelationshipStep } from "./components/RelationshipPath";

interface Member {
  id: string;
  userName: string;
}

export default function SearchPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [personA, setPersonA] = useState<Member | null>(null);
  const [personB, setPersonB] = useState<Member | null>(null);
  const [path, setPath] = useState<RelationshipStep[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const treeId = "1";

  useEffect(() => {
    setLoading(true);
    getTreeMembers(treeId)
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les membres.");
        setLoading(false);
      });
  }, [treeId]);

  const handleSearch = async () => {
    if (!personA || !personB) {
      setError("Veuillez sélectionner deux personnes");
      return;
    }
    
    // Ne pas rechercher si les deux personnes sont identiques
    if (personA.id === personB.id) {
      setError("Veuillez sélectionner deux personnes différentes");
      return;
    }
  
    setLoading(true);
    setError(null);
    setPath([]);
    setIsSuccess(false);
    
    try {
      const res = await getRelationship(personA.id, personB.id, treeId);
      
      if (res.path && res.path.length > 0) {
        setPath(res.path);
        setTotalWeight(res.totalWeight);
        setIsSuccess(true);
      } else {
        setError("Pas de relation trouvée entre ces personnes.");
      }
    } catch (err) {
      console.error("Erreur lors de la recherche de relation:", err);
      setError("Une erreur est survenue lors de la recherche de relation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-8">
          Recherche de lien familial
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <MemberSelect
            label="Personne A"
            options={members}
            value={personA}
            onChange={setPersonA}
          />
          <MemberSelect
            label="Personne B"
            options={members}
            value={personB}
            onChange={setPersonB}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={!personA || !personB || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recherche en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Trouver le lien familial
            </>
          )}
        </button>

        {isSuccess && path.length === 0 && (
          <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded">
            <p className="text-center">Aucun lien familial na été trouvé entre ces personnes.</p>
          </div>
        )}

        {/* Affichage du chemin avec le nouveau composant amélioré */}
        {path.length > 0 && (
          <div className="mt-8">
            <RelationshipPath path={path} totalWeight={totalWeight} />
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { getTreeMembers, getRelationship } from '../lib/api';
import { MemberSelect } from './components/MemberSelect';
import { RelationshipPath } from './components/RelationshipPath';

interface Member {
  id: string;
  userName: string;
}

interface RelationshipStep {
  fromPerson: string;
  toPerson: string;
  relation: string;
}

export default function SearchPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [personA, setPersonA] = useState<Member | null>(null);
  const [personB, setPersonB] = useState<Member | null>(null);
  const [path, setPath] = useState<{ userName: string; relation: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ID de l'arbre à interroger
  const treeId = '1';

  // Charger les membres
  useEffect(() => {
    getTreeMembers(treeId)
      .then(setMembers)
      .catch(err => {
        console.error(err);
        setError('Impossible de charger les membres.');
      });
  }, []);

  // Lancer la recherche de chemin
  const handleSearch = async () => {
    if (!personA || !personB) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getRelationship(personA.id, personB.id, treeId);
      const mapped = res.path.map((step: RelationshipStep) => ({
        userName: step.fromPerson,
        relation: step.relation
      }));
      setPath(mapped);
    } catch (err) {
      console.error(err);
      setError('Recherche impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Recherche de lien familial
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="space-y-4">
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

          <button
            onClick={handleSearch}
            disabled={!personA || !personB || loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            aria-label="Trouver le lien"
            title="Trouver le lien"
          >
            {loading ? 'Recherche…' : 'Trouver le lien'}
          </button>

          <RelationshipPath path={path} />
        </div>
      </div>
    </div>
  );
}

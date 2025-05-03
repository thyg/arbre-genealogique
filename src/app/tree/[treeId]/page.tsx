// src/app/tree/[treeId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams }        from 'next/navigation';
import Navbar               from '../components/navbar';
import Sidebar              from '../components/sidebar';
import TreeGraph            from '../components/treegraph';
import { Person }           from '../types/person';

export default function FamilyTreePage() {
  // 1) on lit l'ID de l'arbre depuis l'URL
  const { treeId } = useParams() as { treeId?: string };

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [persons, setPersons]               = useState<Person[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  useEffect(() => {
    if (!treeId) return; // si pas d'ID on ne fait rien

    setLoading(true);
    setError(null);

    // 2) on interroge notre API Next.js (proxy) 
    fetch(`/api/persons/family-tree/${encodeURIComponent(treeId)}`)
      .then(async res => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        // on suppose la shape { value: "200", data: Person[] }
        if (json.value !== '200') {
          throw new Error(json.text ?? 'Erreur API');
        }
        return json.data as Person[];
      })
      .then(data => {
        setPersons(data);
        // on sélectionne la première personne par défaut
        setSelectedPerson(data[0] || null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Impossible de charger les membres');
      })
      .finally(() => setLoading(false));
  }, [treeId]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handlePersonUpdate = (updated: Person) => {
    setPersons(ps => ps.map(p => p.id === updated.id ? updated : p));
    if (selectedPerson?.id === updated.id) {
      setSelectedPerson(updated);
    }
  };

  const handlePersonDelete = (personId: number) => {
    setPersons(ps => ps.filter(p => p.id !== personId));
    if (selectedPerson?.id === personId) {
      setSelectedPerson(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 3) on passe treeId et la liste à la Navbar */}
      <Navbar familyTreeId={Number(treeId)} persons={persons} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar avec le détail de la personne sélectionnée */}
        <Sidebar
          selectedPerson={selectedPerson}
          onUpdatePerson={handlePersonUpdate}
          onDeletePerson={handlePersonDelete}
        />

        <main className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : (
            // 4) enfin on rend le graphe D3
            <TreeGraph
              persons={persons}
              familyTreeId={Number(treeId)}
              onSelectPerson={handlePersonSelect}
              onUpdatePersons={setPersons}
            />
          )}
        </main>
      </div>
    </div>
  );
}
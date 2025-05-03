'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import TreeGraph from './components/treegraph';
import { Person } from './types/person';

export default function FamilyTreePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [familyTreeId, setFamilyTreeId] = useState<number>(1); // Default family tree ID
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8030/api/persons/family-tree/${familyTreeId}`);
        const result = await response.json();
        
        if (result.value === "200") {
          setPersons(result.data);
        } else {
          setError('Error fetching family tree data');
        }
      } catch (err) {
        setError('Failed to fetch family tree data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, [familyTreeId]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handlePersonUpdate = (updatedPerson: Person) => {
    setPersons(prevPersons => 
      prevPersons.map(p => p.id === updatedPerson.id ? updatedPerson : p)
    );
    
    if (selectedPerson?.id === updatedPerson.id) {
      setSelectedPerson(updatedPerson);
    }
  };

  const handlePersonDelete = (personId: number) => {
    setPersons(prevPersons => prevPersons.filter(p => p.id !== personId));
    if (selectedPerson?.id === personId) {
      setSelectedPerson(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar familyTreeId={familyTreeId} persons={persons} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          selectedPerson={selectedPerson} 
          onUpdatePerson={handlePersonUpdate}
          onDeletePerson={handlePersonDelete}
        />
        <main className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : (
            <TreeGraph 
              persons={persons} 
              familyTreeId={familyTreeId}
              onSelectPerson={handlePersonSelect}
              onUpdatePersons={setPersons}
            />
          )}
        </main>
      </div>
    </div>
  );
}
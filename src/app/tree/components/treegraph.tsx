'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import TreeGraph from '../components/treegraph';
import { Person, FamilyLink } from '../types/person';

// URL de base pour les appels API
const BASE_URL = "/api";

export default function FamilyTreePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [familyTreeId, setFamilyTreeId] = useState<string>("1"); // Changé en string pour correspondre à l'API
  const [persons, setPersons] = useState<Person[]>([]);
  const [links, setLinks] = useState<FamilyLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        
        // Fetch persons en utilisant le proxy API
        const personsResponse = await fetch(`${BASE_URL}/persons/family-tree/${familyTreeId}`);
        const personsResult = await personsResponse.json();
        
        if (personsResult.value !== "200") {
          throw new Error('Error fetching persons data');
        }
        
        setPersons(personsResult.data);

        // Fetch links en utilisant le proxy API
        const linksResponse = await fetch(`${BASE_URL}/family-links/tree/${familyTreeId}`);
        const linksResult = await linksResponse.json();
        
        if (linksResult.value === "200") {
          setLinks(linksResult.data);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch family tree data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchTreeData();
  }, [familyTreeId]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handlePersonUpdate = async (updatedPerson: Person) => {
    try {
      const response = await fetch(`${BASE_URL}/persons/${updatedPerson.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: updatedPerson.firstName,
          lastName: updatedPerson.lastName,
          birthDate: updatedPerson.birthDate,
          birthPlace: updatedPerson.birthPlace,
          gender: updatedPerson.gender
        })
      });

      const result = await response.json();

      if (result.value === "200") {
        setPersons(prevPersons => 
          prevPersons.map(p => p.id === updatedPerson.id ? result.data : p)
        );
        
        if (selectedPerson?.id === updatedPerson.id) {
          setSelectedPerson(result.data);
        }
      }
    } catch (err) {
      console.error('Failed to update person:', err);
    }
  };

  const handlePersonDelete = async (personId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/persons/${personId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPersons(prevPersons => prevPersons.filter(p => p.id !== personId));
        if (selectedPerson?.id === personId) {
          setSelectedPerson(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete person:', err);
    }
  };

  const handleCreateLink = async (newLink: FamilyLink) => {
    try {
      const response = await fetch(`${BASE_URL}/family-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationType: newLink.relationType,
          fromId: newLink.id_source, // Adapté pour correspondre à l'API
          toId: newLink.id_target,   // Adapté pour correspondre à l'API
          familyTreeId: familyTreeId
        })
      });

      const result = await response.json();

      if (result.value === "200") {
        setLinks(prevLinks => [...prevLinks, result.data]);
      }
    } catch (err) {
      console.error('Failed to create link:', err);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/family-link/${linkId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
      }
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const handleUpdateLink = async (updatedLink: FamilyLink) => {
    try {
      const response = await fetch(`${BASE_URL}/family-link/${updatedLink.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationType: updatedLink.relationType
        })
      });

      const result = await response.json();

      if (result.value === "200") {
        setLinks(prevLinks => 
          prevLinks.map(link => link.id === updatedLink.id ? result.data : link)
        );
      }
    } catch (err) {
      console.error('Failed to update link:', err);
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
              links={links}
              onSelectPerson={handlePersonSelect}
              onCreateLink={handleCreateLink}
              onDeleteLink={handleDeleteLink}
              onUpdateLink={handleUpdateLink}
            />
          )}
        </main>
      </div>
    </div>
  );
}
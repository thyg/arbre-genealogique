import React, { useState, useEffect } from 'react';
import { Person } from '../types/person';

interface PersonneComponentProps {
  personId: number;
}

const PersonneComponent: React.FC<PersonneComponentProps> = ({ personId }) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!personId) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8030/api/persons/${personId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setPerson(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [personId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Aucune personne sélectionnée</p>
      </div>
    );
  }

  // Calculate age from birthDate
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(person.birthDate);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          {person.gender === 'MALE' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-800">
            {person.firstName} {person.lastName}
          </h3>
          {age !== null && (
            <p className="text-sm text-gray-500">
              {age} ans
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {person.birthDate && (
          <div>
            <p className="font-medium text-gray-700">Date de naissance</p>
            <p className="text-gray-600">{new Date(person.birthDate).toLocaleDateString()}</p>
          </div>
        )}

        {person.birthPlace && (
          <div>
            <p className="font-medium text-gray-700">Lieu de naissance</p>
            <p className="text-gray-600">{person.birthPlace}</p>
          </div>
        )}

        <div>
          <p className="font-medium text-gray-700">Genre</p>
          <p className="text-gray-600">{person.gender === 'MALE' ? 'Homme' : 'Femme'}</p>
        </div>
      </div>

      {person.outgoingLinks && person.outgoingLinks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Relations</h4>
          <ul className="space-y-1">
            {person.outgoingLinks.map((link) => (
              <li key={link.id} className="text-sm text-gray-600 flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {link.relationType}: {link.targetFirstName} {link.targetLastName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonneComponent;
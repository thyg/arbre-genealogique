'use client';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createFamilyLink } from '@/services/api';
import { FamilyLink } from '@/types/familytree';

interface LinkCreationModalProps {
  mode: 'fromSelected' | 'new';
  sourcePerson?: any;
  onClose: () => void;
  onSubmit: (sourceId: string, targetData: any, relationshipType: string) => void;
}

export default function LinkCreationModal({ mode, sourcePerson, onClose, onSubmit }: LinkCreationModalProps) {
  const [existingPersonMode, setExistingPersonMode] = useState('existing');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [newPersonData, setNewPersonData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    birthDate: '',
    birthPlace: '',
  });

  const handleExistingPersonSubmit = async () => {
    if (!selectedPerson || !selectedRelation) {
      alert('Veuillez sélectionner une personne et une relation');
      return;
    }
    
    try {
      const linkData: FamilyLink = {
        relationType: selectedRelation.toUpperCase(),
        id_source: parseInt(sourcePerson?.id || '1'),
        target: {
          id: parseInt(selectedPerson)
        },
        familyTreeId: 1 // À remplacer par l'ID réel de l'arbre
      };
      
      await createFamilyLink(linkData);
      onSubmit(sourcePerson?.id || '1', { id: selectedPerson }, selectedRelation);
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  // ... (reste de l'implémentation)
}
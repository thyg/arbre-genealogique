import { useState, useRef } from 'react';
import { 
  getPersonById,
  updatePerson,
  createPerson,
  createFamilyLink,
  getPersonsByFamilyTree
} from '@/services/api';

export const useFamilyTree = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [linkCreationMode, setLinkCreationMode] = useState<'fromSelected' | 'new'>('fromSelected');
  
  const loadFamilyData = async (familyTreeId: number) => {
    try {
      const response = await getPersonsByFamilyTree(familyTreeId);
      setFamilyData(response.data);
    } catch (error) {
      console.error('Error loading family data:', error);
    }
  };

  const updatePersonData = async (personId: number, data: any) => {
    try {
      const response = await updatePerson(personId, data);
      setSelectedNode(response.data);
      // Mettre à jour l'état global...
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  // ... autres fonctions et états

  return {
    svgRef,
    tooltipRef,
    selectedNode,
    isEditing,
    isCreatingLink,
    linkCreationMode,
    loadFamilyData,
    updatePersonData,
    // ... autres valeurs retournées
  };
};
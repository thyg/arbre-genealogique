// contexts/FamilyTreeContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FamilyTreeNode, PeopleDatabase, UserData } from '../types/familyTree';

interface FamilyTreeContextType {
  userData: UserData;
  updateUserData: (newData: Partial<UserData>) => void;
  familyData: FamilyTreeNode | null;
  setFamilyData: React.Dispatch<React.SetStateAction<FamilyTreeNode | null>>;
  selectedNode: FamilyTreeNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<FamilyTreeNode | null>>;
  peopleDatabase: PeopleDatabase;
  setPeopleDatabase: React.Dispatch<React.SetStateAction<PeopleDatabase>>;
  createFamilyLink: (sourceId: string, targetData: any, relationshipType: string) => void;
}

const defaultUserData: UserData = {
  profileImage: '',
  userName: 'Utilisateur',
  treeName: 'Mon arbre familial',
  gender: 'male',
  birthDate: '',
  birthPlace: '',
};

const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined);

export const FamilyTreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [familyData, setFamilyData] = useState<FamilyTreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<FamilyTreeNode | null>(null);
  const [peopleDatabase, setPeopleDatabase] = useState<PeopleDatabase>({});

  useEffect(() => {
    // Initialize the family structure with the current user when userData changes
    const initialData: FamilyTreeNode = {
      id: '1',
      name: userData.userName || 'Utilisateur',
      gender: userData.gender || 'male',
      birthDate: userData.birthDate || '',
      birthPlace: userData.birthPlace || '',
      profileImage: userData.profileImage || '',
      type: 'self',
      parents: [],
      children: [],
      partners: []
    };

    setFamilyData(initialData);
    setSelectedNode(initialData);
    setPeopleDatabase({
      '1': initialData
    });
  }, [userData]);

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const createFamilyLink = (sourceId: string, targetData: any, relationshipType: string) => {
    if (!sourceId || !targetData || !relationshipType) return;
    
    // Vérifications spécifiques pour les parents
    if (relationshipType === 'parent') {
      const sourcePerson = peopleDatabase[sourceId];
      
      // Vérification du nombre maximum de parents
      if (sourcePerson.parents.length >= 2) {
        alert('Un individu ne peut avoir que 2 parents maximum');
        return;
      }
      
      // Vérification du genre pour les parents
      if (targetData.id) {
        const targetPerson = peopleDatabase[targetData.id];
        const hasParentOfThisGender = sourcePerson.parents.some(parentId => {
          const parent = peopleDatabase[parentId];
          return parent.gender === targetPerson.gender;
        });
        
        if (hasParentOfThisGender) {
          alert(`Cet individu a déjà un ${targetPerson.gender === 'male' ? 'père' : 'mère'}`);
          return;
        }
      } else {
        const hasParentOfThisGender = sourcePerson.parents.some(parentId => {
          const parent = peopleDatabase[parentId];
          return parent.gender === targetData.gender;
        });
        
        if (hasParentOfThisGender) {
          alert(`Cet individu a déjà un ${targetData.gender === 'male' ? 'père' : 'mère'}`);
          return;
        }
      }
    }
    
    // Création ou mise à jour de la relation
    if (targetData.id) {
      const sourcePerson = peopleDatabase[sourceId];
      const targetPerson = peopleDatabase[targetData.id];
      
      if (!sourcePerson || !targetPerson) return;
      
      // Gestion de toutes les relations
      switch(relationshipType) {
        case 'parent':
          if (!sourcePerson.parents.includes(targetData.id)) {
            sourcePerson.parents.push(targetData.id);
            targetPerson.children.push(sourceId);
          }
          break;
          
        case 'child':
          if (!sourcePerson.children.includes(targetData.id)) {
            sourcePerson.children.push(targetData.id);
            targetPerson.parents.push(sourceId);
          }
          break;
          
        case 'partner':
          if (!sourcePerson.partners.includes(targetData.id)) {
            sourcePerson.partners.push(targetData.id);
            targetPerson.partners.push(sourceId);
          }
          break;
          
        case 'sibling':
          // Pour les frères/soeurs, on ajoute les mêmes parents
          if (sourcePerson.parents.length > 0) {
            sourcePerson.parents.forEach(parentId => {
              if (!targetPerson.parents.includes(parentId)) {
                targetPerson.parents.push(parentId);
                const parent = peopleDatabase[parentId];
                parent.children.push(targetData.id);
              }
            });
          }
          break;
          
        default:
          // Pour les autres relations, on pourrait ajouter un champ 'relationsSpeciales'
          if (!sourcePerson.specialRelations) sourcePerson.specialRelations = [];
          sourcePerson.specialRelations.push({
            type: relationshipType,
            personId: targetData.id
          });
      }
      
      setPeopleDatabase(prev => ({
        ...prev,
        [sourceId]: sourcePerson,
        [targetData.id]: targetPerson
      }));
    } else {
      // Création d'une nouvelle personne
      const newId = Date.now().toString();
      const newPerson: FamilyTreeNode = {
        id: newId,
        name: targetData.name,
        gender: targetData.gender,
        birthDate: targetData.birthDate || '',
        birthPlace: targetData.birthPlace || '',
        profileImage: targetData.profileImage || '',
        parents: [],
        children: [],
        partners: [],
        specialRelations: []
      };
      
      const sourcePerson = peopleDatabase[sourceId];
      if (!sourcePerson) return;
      
      switch(relationshipType) {
        case 'parent':
          sourcePerson.parents.push(newId);
          newPerson.children.push(sourceId);
          break;
          
        case 'child':
          sourcePerson.children.push(newId);
          newPerson.parents.push(sourceId);
          break;
          
        case 'partner':
          sourcePerson.partners.push(newId);
          newPerson.partners.push(sourceId);
          break;
          
        case 'sibling':
          if (sourcePerson.parents.length > 0) {
            newPerson.parents = [...sourcePerson.parents];
            sourcePerson.parents.forEach(parentId => {
              const parent = peopleDatabase[parentId];
              parent.children.push(newId);
            });
          }
          break;
          
        default:
          if (!sourcePerson.specialRelations) sourcePerson.specialRelations = [];
          sourcePerson.specialRelations.push({
            type: relationshipType,
            personId: newId
          });
      }
      
      setPeopleDatabase(prev => ({
        ...prev,
        [sourceId]: sourcePerson,
        [newId]: newPerson
      }));
    }
  };

  return (
    <FamilyTreeContext.Provider value={{
      userData,
      updateUserData,
      familyData,
      setFamilyData,
      selectedNode,
      setSelectedNode,
      peopleDatabase,
      setPeopleDatabase,
      createFamilyLink
    }}>
      {children}
    </FamilyTreeContext.Provider>
  );
};

export const useFamilyTree = () => {
  const context = useContext(FamilyTreeContext);
  if (context === undefined) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
};
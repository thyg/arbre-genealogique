// services/familyApiService.js
// Service pour communiquer avec les API d'arbre généalogique

const API_BASE_URL = '/api'; // Changez selon votre environnement

export const familyApiService = {
  // Créer un nouvel arbre généalogique
  async createFamilyTree(treeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/family-trees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: treeData.name || 'Arbre généalogique',
          description: treeData.description || '',
          geographicOrigin: treeData.geographicOrigin || '',
          creator: treeData.creator || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création de l'arbre: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API createFamilyTree:', error);
      throw error;
    }
  },

  // Créer une personne
  async createPerson(personData, treeId) {
    try {
      // Convertir le format de notre application au format de l'API
      const apiPersonData = {
        firstName: personData.name?.split(' ')[0] || '',
        lastName: personData.name?.split(' ').slice(1).join(' ') || '',
        birthDate: personData.birthDate || null,
        birthPlace: personData.birthPlace || null,
        gender: personData.gender?.toUpperCase() || 'MALE',
        familyTreeId: treeId
      };

      const response = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPersonData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création de la personne: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API createPerson:', error);
      throw error;
    }
  },

  // Créer un lien familial
  async createFamilyLink(sourcePersonId, targetPersonId, relationType, treeId) {
    try {
      const apiLinkData = {
        relationType: mapRelationTypeToAPI(relationType),
        id_source: parseInt(sourcePersonId),
        target: {
          id: parseInt(targetPersonId)
        },
        familyTreeId: treeId
      };

      const response = await fetch(`${API_BASE_URL}/family-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiLinkData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création du lien: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API createFamilyLink:', error);
      throw error;
    }
  },

  // Créer un nouveau membre et le lier en même temps
  async createPersonWithLink(sourcePersonId, newPersonData, relationType, treeId) {
    try {
      // D'abord, créer la personne
      const personResponse = await this.createPerson(newPersonData, treeId);
      const newPersonId = personResponse.id || personResponse.data?.id;

      if (!newPersonId) {
        throw new Error("Impossible de récupérer l'ID de la nouvelle personne");
      }

      // Ensuite, créer le lien
      return await this.createFamilyLink(sourcePersonId, newPersonId, relationType, treeId);
    } catch (error) {
      console.error('Erreur API createPersonWithLink:', error);
      throw error;
    }
  },

  // Récupérer toutes les personnes d'un arbre
  async getPersonsByTreeId(treeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/family-tree/${treeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des personnes: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur API getPersonsByTreeId:', error);
      throw error;
    }
  },

  // Récupérer tous les liens d'un arbre
  async getLinksByTreeId(treeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/family-link/tree/${treeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des liens: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur API getLinksByTreeId:', error);
      throw error;
    }
  },

  // Mettre à jour un lien
  async updateFamilyLink(linkId, newRelationType) {
    try {
      const response = await fetch(`${API_BASE_URL}/family-link/${linkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationType: newRelationType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du lien: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API updateFamilyLink:', error);
      throw error;
    }
  },

  // Récupérer l'arbre complet
  async getFamilyTree(treeId) {
    try {
      // Récupérer les informations de l'arbre
      const treeResponse = await fetch(`${API_BASE_URL}/family-trees/${treeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!treeResponse.ok) {
        throw new Error(`Erreur lors de la récupération de l'arbre: ${treeResponse.status}`);
      }

      const treeData = await treeResponse.json();
      
      // Récupérer toutes les personnes de l'arbre
      const personsData = await this.getPersonsByTreeId(treeId);
      
      // Récupérer tous les liens
      const linksData = await this.getLinksByTreeId(treeId);
      
      // Retourner l'ensemble
      return {
        tree: treeData.data,
        persons: personsData,
        links: linksData
      };
    } catch (error) {
      console.error('Erreur API getFamilyTree:', error);
      throw error;
    }
  }
};

// Fonction utilitaire pour mapper les types de relations de notre app aux types de l'API
function mapRelationTypeToAPI(relationType) {
  const relationMap = {
    'parent': 'PARENT',
    'child': 'CHILD',
    'partner': 'SPOUSE',
    'sibling': 'SIBLING',
    'uncle': 'UNCLE',
    'aunt': 'AUNT',
    'nephew': 'NEPHEW',
    'niece': 'NIECE',
    'cousin': 'COUSIN',
    'grandparent': 'GRANDPARENT',
    'grandchild': 'GRANDCHILD'
  };

  return relationMap[relationType] || 'OTHER';
}

// Fonction pour convertir les données API en format pour notre application
export function convertAPIDataToAppFormat(apiData) {
  const people = {};
  
  // Convertir les personnes
  if (apiData.persons && Array.isArray(apiData.persons)) {
    apiData.persons.forEach(person => {
      people[person.id] = {
        id: person.id.toString(),
        name: `${person.firstName} ${person.lastName}`.trim(),
        gender: person.gender.toLowerCase(),
        birthDate: person.birthDate,
        birthPlace: person.birthPlace,
        profileImage: '', // Les API ne gèrent pas encore les images
        parents: [],
        children: [],
        partners: []
      };
    });
  }
  
  // Ajouter les relations basées sur les liens
  if (apiData.links && Array.isArray(apiData.links)) {
    apiData.links.forEach(link => {
      const sourceId = link.id_source.toString();
      const targetId = link.target?.id?.toString();
      
      if (!sourceId || !targetId || !people[sourceId] || !people[targetId]) return;
      
      switch (link.relationType) {
        case 'PARENT':
          if (!people[targetId].children.includes(sourceId)) {
            people[targetId].children.push(sourceId);
          }
          if (!people[sourceId].parents.includes(targetId)) {
            people[sourceId].parents.push(targetId);
          }
          break;
          
        case 'CHILD':
          if (!people[sourceId].children.includes(targetId)) {
            people[sourceId].children.push(targetId);
          }
          if (!people[targetId].parents.includes(sourceId)) {
            people[targetId].parents.push(sourceId);
          }
          break;
          
        case 'SPOUSE':
        case 'PARTNER':
          if (!people[sourceId].partners.includes(targetId)) {
            people[sourceId].partners.push(targetId);
          }
          if (!people[targetId].partners.includes(sourceId)) {
            people[targetId].partners.push(sourceId);
          }
          break;
      }
    });
  }
  
  // Trouver la personne racine (créateur de l'arbre ou première personne)
  let rootPerson = null;
  
  if (apiData.tree && apiData.tree.creator) {
    // Chercher le créateur parmi les personnes
    const creator = Object.values(people).find(p => 
      `${p.name}`.toLowerCase().includes(apiData.tree.creator.toLowerCase())
    );
    
    if (creator) {
      rootPerson = creator;
    }
  }
  
  // Si on n'a pas trouvé de créateur, prendre la première personne
  if (!rootPerson && Object.values(people).length > 0) {
    rootPerson = Object.values(people)[0];
  }
  
  return {
    peopleDatabase: people,
    familyData: rootPerson
  };
}
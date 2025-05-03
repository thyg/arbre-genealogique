// Utilitaires pour traiter et préparer les données de l'arbre généalogique

/**
 * Convertit la structure de données familiale en structure hiérarchique
 * pour la visualisation de l'arbre
 */
export const createHierarchicalData = (rootPerson, peopleDatabase) => {
    if (!rootPerson) return null;
    
    const visited = new Set();
    
    const processPerson = (personId, level = 0, position = 0) => {
      if (!personId || visited.has(personId)) return null;
      
      const person = peopleDatabase[personId];
      if (!person) return null;
      
      visited.add(personId);
      
      // Process the current person
      const result = { 
        ...person, 
        level, // Use level for vertical positioning (generations)
        position, // Use position for horizontal ordering
        children: [] // This will contain displayed hierarchy, not actual family relationships
      };
      
      // Process partners - put them on the same level
      for (const partnerId of person.partners || []) {
        if (!visited.has(partnerId)) {
          const partner = processPerson(partnerId, level, position + 1);
          if (partner) {
            result.children.push(partner);
          }
        }
      }
      
      // Process children - put them one level down
      if (person.children && person.children.length > 0) {
        const childrenNodes = [];
        for (const childId of person.children) {
          if (!visited.has(childId)) {
            const child = processPerson(childId, level + 1, childrenNodes.length);
            if (child) {
              childrenNodes.push(child);
            }
          }
        }
        
        // If we have children, create a "family node" to connect them
        if (childrenNodes.length > 0) {
          const familyNode = {
            id: `family-${personId}`,
            isFamilyNode: true,
            level: level + 0.5,
            position,
            children: childrenNodes
          };
          result.children.push(familyNode);
        }
      }
      
      // Process parents - put them one level up
      if (person.parents && person.parents.length > 0) {
        const parentsNodes = [];
        for (const parentId of person.parents) {
          if (!visited.has(parentId)) {
            const parent = processPerson(parentId, level - 1, parentsNodes.length);
            if (parent) {
              parentsNodes.push(parent);
            }
          }
        }
        
        // If we have parents, create a "family node" to connect them
        if (parentsNodes.length > 0) {
          const familyNode = {
            id: `family-parent-${personId}`,
            isFamilyNode: true,
            level: level - 0.5,
            position,
            children: parentsNodes
          };
          result.children.push(familyNode);
        }
      }
      
      return result;
    };
    
    return processPerson(rootPerson.id); // Start with the root person
  };
  
  /**
   * Convertit l'arbre hiérarchique en structure stratifiée pour D3
   */
  export const stratifyData = (node, parent = null, result = []) => {
    if (!node) return result;
    
    // Add the current node to the result
    result.push({
      id: node.id,
      parentId: parent ? parent.id : null,
      node: node,
      isFamilyNode: node.isFamilyNode || false
    });
    
    // Process children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        stratifyData(child, node, result);
      }
    }
    
    return result;
  };
  
  /**
   * Calcule les positions X et Y pour tous les noeuds
   */
  export const calculateNodePositions = (nodes, nodeWidth, nodeHeight, siblingSpacing, levelHeight) => {
    const positions = {};
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    // Group nodes by level
    const nodesByLevel = {};
    nodes.forEach(node => {
      const level = node.node.level;
      if (!nodesByLevel[level]) {
        nodesByLevel[level] = [];
      }
      nodesByLevel[level].push(node);
    });
    
    // Sort levels
    const levels = Object.keys(nodesByLevel).sort((a, b) => a - b);
    
    // Calculate positions level by level
    levels.forEach(level => {
      const levelNodes = nodesByLevel[level];
      const y = level * levelHeight;
      
      // Sort nodes horizontally
      levelNodes.sort((a, b) => {
        // Family nodes should maintain their parent's position
        if (a.node.isFamilyNode && b.node.isFamilyNode) {
          return a.node.position - b.node.position;
        }
        if (a.node.isFamilyNode) return -1;
        if (b.node.isFamilyNode) return 1;
        return a.node.position - b.node.position;
      });
      
      // Calculate x positions
      let totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * siblingSpacing;
      let startX = -totalWidth / 2;
      
      levelNodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + siblingSpacing) + (nodeWidth / 2);
        
        positions[node.id] = {
          x,
          y,
          node: node.node,
          parentId: node.parentId
        };
        
        minX = Math.min(minX, x - nodeWidth/2);
        maxX = Math.max(maxX, x + nodeWidth/2);
        minY = Math.min(minY, y - nodeHeight/2);
        maxY = Math.max(maxY, y + nodeHeight/2);
      });
    });
    
    return { positions, minX, maxX, minY, maxY };
  };
  
  /**
   * Valide une relation familiale
   * Vérifie si la relation est permise selon les règles de l'application
   */
  export const validateFamilyRelation = (sourceId, targetId, relationType, peopleDatabase) => {
    const sourcePerson = peopleDatabase[sourceId];
    const targetPerson = peopleDatabase[targetId];
    
    if (!sourcePerson || !targetPerson) return { valid: false, message: "Personne(s) introuvable(s)" };
    
    // Vérification des parents (max 2, un de chaque genre)
    if (relationType === 'parent') {
      if (sourcePerson.parents.length >= 2) {
        return { valid: false, message: "Un individu ne peut avoir que 2 parents maximum" };
      }
      
      const hasParentOfThisGender = sourcePerson.parents.some(parentId => {
        const parent = peopleDatabase[parentId];
        return parent && parent.gender === targetPerson.gender;
      });
      
      if (hasParentOfThisGender) {
        return { 
          valid: false, 
          message: `Cet individu a déjà un ${targetPerson.gender === 'male' ? 'père' : 'mère'}`
        };
      }
    }
    
    // Autres validations pourraient être ajoutées ici
    
    return { valid: true };
  };
  
  /**
   * Crée ou met à jour une relation familiale
   */
  export const createRelation = (sourceId, targetId, relationType, peopleDatabase) => {
    // Clone la base de données pour ne pas modifier l'original directement
    const updatedDatabase = { ...peopleDatabase };
    const sourcePerson = { ...updatedDatabase[sourceId] };
    const targetPerson = { ...updatedDatabase[targetId] };
    
    // Met à jour les relations selon le type
    switch(relationType) {
      case 'parent':
        if (!sourcePerson.parents.includes(targetId)) {
          sourcePerson.parents = [...sourcePerson.parents, targetId];
          targetPerson.children = [...targetPerson.children, sourceId];
        }
        break;
        
      case 'child':
        if (!sourcePerson.children.includes(targetId)) {
          sourcePerson.children = [...sourcePerson.children, targetId];
          targetPerson.parents = [...targetPerson.parents, sourceId];
        }
        break;
        
      case 'partner':
        if (!sourcePerson.partners.includes(targetId)) {
          sourcePerson.partners = [...sourcePerson.partners, targetId];
          targetPerson.partners = [...targetPerson.partners, sourceId];
        }
        break;
        
      // Autres types de relations...
    }
    
    // Met à jour la base de données
    updatedDatabase[sourceId] = sourcePerson;
    updatedDatabase[targetId] = targetPerson;
    
    return updatedDatabase;
  };
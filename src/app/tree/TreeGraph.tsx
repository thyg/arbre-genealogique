'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FaUser, FaPlus, FaEdit, FaArrowsAlt, FaLink, FaCamera, FaTimes } from 'react-icons/fa';

export default function TreeGraph({ userData, updateUserData }) {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [familyData, setFamilyData] = useState(null);
  const [peopleDatabase, setPeopleDatabase] = useState({});
  const [linkCreationMode, setLinkCreationMode] = useState('fromSelected');

  // Initialize the family structure with the current user
  useEffect(() => {
    const initialData = {
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

  // Redraw the tree whenever the data changes
  useEffect(() => {
    if (familyData && svgRef.current) {
      drawFamilyTree();
    }
  }, [familyData, selectedNode, peopleDatabase]);

  // Convert our family data structure to a standardized hierarchical format
  const createHierarchicalData = () => {
    // Create a hierarchical structure similar to the image reference
    // Starting from the bottom (the user) and working up to ancestors
    // This will create a more traditional family tree layout
    
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
    
    return processPerson('1'); // Start with the root person (self)
  };

  const drawFamilyTree = () => {
    if (!familyData) return;

    // Clear the previous rendering
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll('*').remove();

    // Setup dimensions and spacing
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 80, right: 120, bottom: 80, left: 120 };
    
    // Node sizing
    const nodeWidth = 120;
    const nodeHeight = 60;
    const levelHeight = 120; // Consistent vertical spacing between levels
    const siblingSpacing = 40; // Horizontal spacing between siblings

    // Create the hierarchical data
    const root = createHierarchicalData();
    if (!root) return;

    // Create a stratify layout using our custom hierarchy
    const stratifiedData = stratifyData(root);
    
    // Calculate the positions
    const positions = calculateNodePositions(stratifiedData, nodeWidth, nodeHeight, siblingSpacing, levelHeight);
    
    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Create the main group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw the links between nodes
    drawLinks(g, positions);
    
    // Draw the nodes
    drawNodes(g, positions);
    
    // Set initial zoom and pan to center the tree
    const initialScale = 0.8;
    const initialX = width / 2 - (positions.maxX - positions.minX) * initialScale / 2;
    const initialY = height / 3 - positions.minY * initialScale;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));
  };

  // Helper function to convert our tree to a stratified structure
  const stratifyData = (node, parent = null, result = []) => {
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

  // Calculate the x, y positions for all nodes
  const calculateNodePositions = (nodes, nodeWidth, nodeHeight, siblingSpacing, levelHeight) => {
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

  // Draw links between nodes
  const drawLinks = (g, { positions }) => {
    // Create links array
    const links = [];
    
    Object.values(positions).forEach(position => {
      if (position.parentId && positions[position.parentId]) {
        links.push({
          source: positions[position.parentId],
          target: position
        });
      }
    });
    
    // Draw the links
    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        if (d.source.node.isFamilyNode || d.target.node.isFamilyNode) {
          // Simple straight line for family connections
          return `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`;
        } else {
          // For regular links, use curved paths
          return `M ${d.source.x} ${d.source.y} 
                  C ${d.source.x} ${(d.source.y + d.target.y) / 2},
                    ${d.target.x} ${(d.source.y + d.target.y) / 2},
                    ${d.target.x} ${d.target.y}`;
        }
      })
      .attr('stroke', d => {
        // Family nodes get a dashed line
        if (d.source.node.isFamilyNode || d.target.node.isFamilyNode) {
          return '#888';
        }
        
        // Partner connections
        if (d.source.node.partners && d.source.node.partners.includes(d.target.node.id)) {
          return '#9333ea';
        }
        
        // Child connections
        if (d.source.node.children && d.source.node.children.includes(d.target.node.id)) {
          return '#4f46e5';
        }
        
        // Parent connections
        if (d.target.node.parents && d.target.node.parents.includes(d.source.node.id)) {
          return '#059669';
        }
        
        return '#888';
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-dasharray', d => {
        return (d.source.node.isFamilyNode || d.target.node.isFamilyNode) ? '5,5' : 'none';
      });
  };

  // Draw nodes
  const drawNodes = (g, { positions }) => {
    // Create node groups
    const nodeGroups = g.selectAll('.node')
      .data(Object.values(positions).filter(p => !p.node.isFamilyNode))
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(peopleDatabase[d.node.id]);
      });
    
    // Draw node background rectangle
    nodeGroups.append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => {
        if (d.node.type === 'self') {
          return d.node.gender === 'male' ? '#bfdbfe' : '#fbcfe8';
        }
        return d.node.gender === 'male' ? '#dbeafe' : '#fce7f3';
      })
      .attr('stroke', d => {
        if (selectedNode && selectedNode.id === d.node.id) {
          return '#000';
        }
        return d.node.gender === 'male' ? '#3b82f6' : '#ec4899';
      })
      .attr('stroke-width', d => selectedNode && selectedNode.id === d.node.id ? 3 : 1)
      .attr('opacity', 0.9);
    
    // Draw profile image or icon
    nodeGroups.append('circle')
      .attr('cy', -10)
      .attr('r', 15)
      .attr('fill', d => {
        if (d.node.profileImage) {
          return 'url(#pattern-' + d.node.id + ')';
        }
        return d.node.gender === 'male' ? '#93c5fd' : '#f9a8d4';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Add pattern for profile images
    nodeGroups.filter(d => d.node.profileImage)
      .append('defs')
      .append('pattern')
      .attr('id', d => 'pattern-' + d.node.id)
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('image')
      .attr('width', 1)
      .attr('height', 1)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('xlink:href', d => d.node.profileImage);
    
    // Add user icon if no profile image
    nodeGroups.filter(d => !d.node.profileImage)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('y', -10)
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '14px')
      .attr('fill', '#fff')
      .text('\uf007');
    
    // Add name
    nodeGroups.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(d => {
        const name = d.node.name || 'Inconnu';
        return name.length > 15 ? name.substring(0, 12) + '...' : name;
      })
      .style('font-size', '12px')
      .style('fill', '#333');
    
    // Add relationship label
    nodeGroups.filter(d => d.node.relationship)
      .append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text(d => {
        switch(d.node.relationship) {
          case 'parent': return d.node.gender === 'male' ? 'Père' : 'Mère';
          case 'partner': return 'Conjoint(e)';
          case 'child': return 'Enfant';
          case 'grandparent': return d.node.gender === 'male' ? 'Grand-père' : 'Grand-mère';
          case 'great-grandparent': return d.node.gender === 'male' ? 'Arrière-grand-père' : 'Arrière-grand-mère';
          default: return '';
        }
      })
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-style', 'italic');
    


      nodeGroups.filter(d => d.node.specialRelations)
  .append('text')
  .attr('dy', 45)
  .attr('text-anchor', 'middle')
  .text(d => {
    const specialRelations = d.node.specialRelations || [];
    return specialRelations.map(rel => {
      switch(rel.type) {
        case 'sibling': return 'Frère/Soeur';
        case 'uncle': return 'Oncle';
        case 'aunt': return 'Tante';
        case 'nephew': return 'Neveu';
        case 'niece': return 'Nièce';
        case 'cousin': return 'Cousin(e)';
        case 'grandparent': return 'Grand-parent';
        case 'grandchild': return 'Petit-enfant';
        default: return '';
      }
    }).filter(Boolean).join(', ');
  })
  .style('font-size', '9px')
  .style('fill', '#666')
  .style('font-style', 'italic');
    // Draw family nodes (small dots for connections)
    g.selectAll('.family-node')
      .data(Object.values(positions).filter(p => p.node.isFamilyNode))
      .enter()
      .append('circle')
      .attr('class', 'family-node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', '#888')
      .attr('opacity', 0.6);
  };

  const createFamilyLink = (sourceId, targetData, relationshipType) => {
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
          
        // Les autres relations (oncle, tante, etc.) peuvent être gérées comme des relations spéciales
        // qui n'ont pas d'impact direct sur la structure de l'arbre
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
      const newPerson = {
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
    
    setIsCreatingLink(false);
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCreateLinkClick = () => {
    if (selectedNode) {
      setLinkCreationMode('fromSelected');
      setIsCreatingLink(true);
    } else {
      setLinkCreationMode('new');
      setIsCreatingLink(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      profileImage: userData.profileImage,
      userName: userData.userName,
      treeName: userData.treeName,
      gender: userData.gender,
      birthDate: userData.birthDate,
      birthPlace: userData.birthPlace
    });
  };

  const handleSaveEdit = () => {
    updateUserData(editForm);
    setIsEditing(false);
    
    setFamilyData(prev => ({
      ...prev,
      name: editForm.userName,
      gender: editForm.gender,
      birthDate: editForm.birthDate,
      birthPlace: editForm.birthPlace,
      profileImage: editForm.profileImage
    }));
    
    setPeopleDatabase(prev => ({
      ...prev,
      '1': {
        ...prev['1'],
        name: editForm.userName,
        gender: editForm.gender,
        birthDate: editForm.birthDate,
        birthPlace: editForm.birthPlace,
        profileImage: editForm.profileImage
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm(prev => ({ ...prev, profileImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 relative overflow-hidden">
      {/* Edit Profile Form */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Modifier mon profil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-md ${
                    editForm.profileImage ? '' : editForm.gender === 'male' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'
                  }`}>
                    {editForm.profileImage ? (
                      <img src={editForm.profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <FaUser className={`h-6 w-6 ${editForm.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'arbre
                </label>
                <input
                  type="text"
                  name="treeName"
                  value={editForm.treeName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="userName"
                  value={editForm.userName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  name="gender"
                  value={editForm.gender || 'male'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="text"
                  name="birthDate"
                  placeholder="AAAA-MM-JJ"
                  value={editForm.birthDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={editForm.birthPlace || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Link Creation Modal */}
      {isCreatingLink && (
        <LinkCreationModal
          mode={linkCreationMode}
          sourcePerson={selectedNode}
          peopleDatabase={peopleDatabase}
          onClose={() => setIsCreatingLink(false)}
          onSubmit={createFamilyLink}
        />
      )}

      <div className="absolute inset-0">
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div ref={tooltipRef} className="absolute hidden"></div>
      </div>

      {/* Control panel with zoom controls and instructions */}
      <div className="absolute left-4 top-4 bg-white p-2 rounded-lg shadow-md text-sm opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-2 text-gray-600">
          <FaArrowsAlt className="text-blue-500" />
          <span>Utilisez la molette pour zoomer et cliquez-glissez pour vous déplacer</span>
        </div>
      </div>

      {/* Person info panel */}
      {selectedNode && (
        <div className="absolute right-4 top-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-md ${selectedNode.profileImage ? '' : selectedNode.gender === 'male' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'}`}>
              {selectedNode.profileImage ? (
                <img src={selectedNode.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <FaUser className={`h-6 w-6 ${selectedNode.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{selectedNode.name || 'Inconnu'}</h3>
              <p className="text-xs text-gray-500">
                {selectedNode.type === 'self' ? 'Moi' : 
                 selectedNode.relationship === 'parent' ? (selectedNode.gender === 'male' ? 'Père' : 'Mère') :
                 selectedNode.relationship === 'child' ? 'Enfant' :
                 selectedNode.relationship === 'partner' ? 'Conjoint(e)' : ''}
              </p>
            </div>
          </div>
          
          {/* Person details */}
          <div className="space-y-2 text-sm mb-4">
            <div>
              <span className="text-gray-600">Genre:</span> {selectedNode.gender === 'male' ? 'Masculin' : 'Féminin'}
            </div>
            
            {selectedNode.birthDate && (
              <div>
                <span className="text-gray-600">Naissance:</span> {selectedNode.birthDate}
              </div>
            )}
            
            {selectedNode.birthPlace && (
              <div>
                <span className="text-gray-600">Lieu:</span> {selectedNode.birthPlace}
              </div>
            )}
            
          <div>
            <span className="text-gray-600">Relations:</span> {' '}
            {selectedNode.parents.length} parent(s), {' '}
            {selectedNode.children.length} enfant(s), {' '}
            {selectedNode.partners.length} conjoint(s)
            {selectedNode.specialRelations?.length > 0 && (
              <>, {selectedNode.specialRelations.length} relation(s) spéciale(s)</>
            )}
          </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            {selectedNode.type === 'self' ? (
              // Only self user can edit their profile
              <button 
                onClick={handleEditClick}
                className="flex items-center space-x-1 px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                <FaEdit />
                <span>Modifier</span>
              </button>
            ) : (
              // For others, will add edit functionality later
              <div></div>
            )}
            
            <button 
              onClick={handleCreateLinkClick}
              className="flex items-center space-x-1 px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
            >
              <FaLink />
              <span>Lier</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Add new person button */}
      <button 
        onClick={() => {
          setLinkCreationMode('new');
          setIsCreatingLink(true);
        }}
        className="absolute right-4 bottom-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        title="Ajouter une personne"
      >
        <FaPlus className="h-5 w-5" />
      </button>
    </div>
  );
}

// Sub-component for link creation modal
function LinkCreationModal({ mode, sourcePerson, peopleDatabase, onClose, onSubmit }) {
  const [existingPersonMode, setExistingPersonMode] = useState('existing');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [newPersonData, setNewPersonData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
    birthPlace: '',
    profileImage: ''
  });
  
  const handleExistingPersonSubmit = () => {
    if (!selectedPerson || !selectedRelation) {
      alert('Veuillez sélectionner une personne et une relation');
      return;
    }
    
    onSubmit(sourcePerson?.id || '1', { id: selectedPerson }, selectedRelation);
  };
  
  const handleNewPersonSubmit = () => {
    if (!newPersonData.name || !selectedRelation) {
      alert('Veuillez remplir au moins le nom et sélectionner une relation');
      return;
    }
    
    onSubmit(sourcePerson?.id || '1', newPersonData, selectedRelation);
  };
  
  const availablePeople = Object.values(peopleDatabase).filter(person => {
    // Filter out the source person
    if (sourcePerson && person.id === sourcePerson.id) return false;
    
    // Filter based on relationship type and existing relationships
    if (selectedRelation === 'parent') {
      // For parent relationship, filter out existing parents and children
      if (sourcePerson && sourcePerson.parents.includes(person.id)) return false;
      if (sourcePerson && person.children.includes(sourcePerson.id)) return false;
    } else if (selectedRelation === 'child') {
      // For child relationship, filter out existing children and parents
      if (sourcePerson && sourcePerson.children.includes(person.id)) return false;
      if (sourcePerson && person.parents.includes(sourcePerson.id)) return false;
    } else if (selectedRelation === 'partner') {
      // For partner relationship, filter out existing partners
      if (sourcePerson && sourcePerson.partners.includes(person.id)) return false;
    }
    
    return true;
  });
  
  return (
    <div className="absolute inset-0  bg-opacity-50 z-10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === 'fromSelected' ? `Ajouter une relation à ${sourcePerson?.name || 'cette personne'}` : 'Créer une nouvelle personne'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        {/* Relationship Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de relation
          </label>
          <select
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
              <option value="">Sélectionnez une relation</option>
              <option value="parent">Parent</option>
              <option value="child">Enfant</option>
              <option value="partner">Conjoint(e)</option>
              <option value="sibling">Frère/Soeur</option>
              <option value="uncle">Oncle</option>
              <option value="aunt">Tante</option>
              <option value="nephew">Neveu</option>
              <option value="niece">Nièce</option>
              <option value="cousin">Cousin(e)</option>
              <option value="grandparent">Grand-parent</option>
              <option value="grandchild">Petit-enfant</option>
          </select>
        </div>
        
        {/* Person Selection Tabs */}
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium ${existingPersonMode === 'existing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setExistingPersonMode('existing')}
            >
              Personne existante
            </button>
            <button
              className={`py-2 px-4 font-medium ${existingPersonMode === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setExistingPersonMode('new')}
            >
              Nouvelle personne
            </button>
          </div>
          
          {/* Existing Person Selection */}
          {existingPersonMode === 'existing' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner une personne
              </label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choisir une personne</option>
                {availablePeople.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name || 'Sans nom'} {person.relationship ? `(${person.relationship})` : ''}
                  </option>
                ))}
              </select>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExistingPersonSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!selectedPerson || !selectedRelation}
                >
                  Créer la relation
                </button>
              </div>
            </div>
          )}
          
          {/* New Person Form */}
          {existingPersonMode === 'new' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newPersonData.name}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={newPersonData.gender}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="text"
                  placeholder="AAAA-MM-JJ"
                  value={newPersonData.birthDate}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={newPersonData.birthPlace}
                  onChange={(e) => setNewPersonData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setNewPersonData(prev => ({ ...prev, profileImage: e.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-sm text-gray-600"
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleNewPersonSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!newPersonData.name || !selectedRelation}
                >
                  Créer la personne
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
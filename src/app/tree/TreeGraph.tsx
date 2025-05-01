'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FaUser, FaPlus, FaEdit, FaArrowsAlt, FaLink } from 'react-icons/fa';
import ProfileEditForm from './ProfileEditForm';
import FamilyLinkForm from './FamilyLinkForm';

export default function TreeGraph({ userData, updateUserData }) {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [familyData, setFamilyData] = useState(null);
  const [peopleDatabase, setPeopleDatabase] = useState({});
  const [linkFormData, setLinkFormData] = useState({
    sourceId: '',
    sourceName: '',
    targetName: '',
    targetGender: 'male',
    targetBirthDate: '',
    targetBirthPlace: '',
    relationshipType: 'child'
  });

  // Initialize the family structure with the current user
  useEffect(() => {
    // Initial root user setup
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
    
    // Add to database
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

  // Convert our family data structure to a hierarchical structure for d3
  const createHierarchicalData = () => {
    const processedNodes = new Set();
    
    // Process a person for hierarchy view, without recursion
    const processPerson = (personId) => {
      if (!personId || processedNodes.has(personId)) return null;
      
      const person = peopleDatabase[personId];
      if (!person) return null;
      
      // Add to processed set to prevent infinite recursion
      processedNodes.add(personId);
      
      const result = { ...person };
      const hierarchicalChildren = [];
      
      // Add partners on same level
      for (const partnerId of result.partners || []) {
        const partner = peopleDatabase[partnerId];
        if (partner) {
          hierarchicalChildren.push({ 
            ...partner, 
            relationship: 'partner',
            hierarchicalChildren: [] 
          });
        }
      }
      
      // Add children below
      for (const childId of result.children || []) {
        const child = peopleDatabase[childId];
        if (child) {
          hierarchicalChildren.push({ 
            ...child, 
            relationship: 'child',
            hierarchicalChildren: [] 
          });
        }
      }
      
      // If main person, add parents above
      if (result.type === 'self' || !result.relationship) {
        for (const parentId of result.parents || []) {
          const parent = peopleDatabase[parentId];
          if (parent) {
            const parentCopy = { 
              ...parent, 
              relationship: 'parent',
              hierarchicalChildren: []
            };
            
            // Add grandparents (but limit to one level to avoid recursion)
            for (const grandparentId of parent.parents || []) {
              const grandparent = peopleDatabase[grandparentId];
              if (grandparent) {
                parentCopy.hierarchicalChildren.push({
                  ...grandparent,
                  relationship: 'grandparent',
                  hierarchicalChildren: []
                });
              }
            }
            
            hierarchicalChildren.push(parentCopy);
          }
        }
      }
      
      if (hierarchicalChildren.length > 0) {
        result.hierarchicalChildren = hierarchicalChildren;
      }
      
      return result;
    };
    
    // Start from the family data root
    return processPerson('1');
  };

  const drawFamilyTree = () => {
    if (!familyData) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 80, right: 120, bottom: 80, left: 120 };
    const nodeWidth = 180;
    const nodeHeight = 80;
    
    // Create the hierarchical data for d3
    const hierarchicalData = createHierarchicalData();
    if (!hierarchicalData) return;
    
    const root = d3.hierarchy(hierarchicalData, d => d.hierarchicalChildren);
    
    // Create a custom tree layout
    const treeLayout = d3.tree()
      .nodeSize([nodeWidth, nodeHeight])
      .separation((a, b) => {
        // Adjust separation based on relationship
        if (a.data.relationship === 'partner' && b.data.relationship === 'partner') {
          return 1.2; // Partners closer together
        } else if (a.data.relationship === 'parent' && b.data.relationship === 'parent') {
          return 1.5; // Parents spaced out
        } else {
          return 2; // Default separation
        }
      });
    
    // Apply the layout to our data
    const treeData = treeLayout(root);
    
    // Adjust positions based on relationships
    treeData.descendants().forEach(d => {
      // Adjust y-position based on generation/relationship
      if (d.data.relationship === 'parent' || d.data.relationship === 'grandparent') {
        d.y = d.y - 100; // Move parents up
      } else if (d.data.relationship === 'partner') {
        d.y = d.parent.y; // Keep partners on same level as parent
      } else if (d.data.relationship === 'child') {
        d.y = d.y + 50; // Move children down
      }
    });
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Create main group for all elements with initial transform
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left + width/4},${margin.top})`);
    
    // Draw links between nodes
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        // Create different link paths based on relationship
        if (d.target.data.relationship === 'partner') {
          // Horizontal line for partners
          return `M ${d.source.x} ${d.source.y} H ${d.target.x}`;
        } else {
          // Curved paths for parents/children
          return d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)(d);
        }
      })
      .attr('stroke', d => {
        // Color links based on relationship
        if (d.target.data.relationship === 'partner') {
          return '#9333ea'; // Purple for partnerships
        } else if (d.target.data.relationship === 'child') {
          return '#4f46e5'; // Indigo for child relationships
        } else {
          return '#059669'; // Green for parent relationships
        }
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-dasharray', d => 
        d.target.data.relationship === 'partner' ? '5,5' : 'none'
      );
    
    // Create node groups
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
        // Update link form data if creating link from selected node
        if (d.data.id) {
          setLinkFormData(prev => ({
            ...prev,
            sourceId: d.data.id,
            sourceName: d.data.name
          }));
        }
      });
    
    // Add node backgrounds
    nodes.append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => {
        if (d.data.type === 'self') {
          return d.data.gender === 'male' ? '#bfdbfe' : '#fbcfe8'; // Highlighted main person
        }
        return d.data.gender === 'male' ? '#dbeafe' : '#fce7f3'; // Regular nodes
      })
      .attr('stroke', d => {
        // Highlight selected node
        if (selectedNode && selectedNode.id === d.data.id) {
          return '#000';
        }
        return d.data.gender === 'male' ? '#3b82f6' : '#ec4899';
      })
      .attr('stroke-width', d => selectedNode && selectedNode.id === d.data.id ? 3 : 1)
      .attr('opacity', 0.8);
    
    // Add profile images or user icons
    nodes.append('circle')
      .attr('cy', -10)
      .attr('r', 15)
      .attr('fill', d => {
        if (d.data.profileImage) {
          return 'url(#pattern-' + d.data.id + ')';
        }
        return d.data.gender === 'male' ? '#93c5fd' : '#f9a8d4';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Define patterns for profile images
    nodes.filter(d => d.data.profileImage)
      .append('defs')
      .append('pattern')
      .attr('id', d => 'pattern-' + d.data.id)
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('image')
      .attr('width', 1)
      .attr('height', 1)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('xlink:href', d => d.data.profileImage);
    
    // Add user icons for nodes without images
    nodes.filter(d => !d.data.profileImage)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('y', -10)
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '14px')
      .attr('fill', '#fff')
      .text('\uf007'); // Unicode for user icon
    
    // Add name labels
    nodes.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(d => {
        // Truncate long names
        const name = d.data.name || 'Inconnu';
        return name.length > 15 ? name.substring(0, 12) + '...' : name;
      })
      .style('font-size', '12px')
      .style('fill', '#333');
    
    // Add relationship labels for clarity
    nodes.filter(d => d.data.relationship)
      .append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text(d => {
        switch(d.data.relationship) {
          case 'parent': return d.data.gender === 'male' ? 'Père' : 'Mère';
          case 'partner': return 'Conjoint(e)';
          case 'child': return 'Enfant';
          case 'grandparent': return d.data.gender === 'male' ? 'Grand-père' : 'Grand-mère';
          default: return '';
        }
      })
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-style', 'italic');
    
    // Center the view on the root node
    const initialScale = 0.8;
    const initialX = width / 2 - treeData.x * initialScale;
    const initialY = height / 3 - treeData.y * initialScale;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));
  };

  // Create family link function
  const createFamilyLink = (formData) => {
    if (!formData.sourceId || !formData.targetName) return;
    
    // Create a new person based on form data
    const newId = Date.now().toString();
    const newPerson = {
      id: newId,
      name: formData.targetName,
      gender: formData.targetGender,
      birthDate: formData.targetBirthDate || '',
      birthPlace: formData.targetBirthPlace || '',
      profileImage: '',
      parents: [],
      children: [],
      partners: []
    };
    
    // Get the source person
    const sourcePerson = peopleDatabase[formData.sourceId];
    if (!sourcePerson) return;
    
    // Update relationships based on the type
    switch(formData.relationshipType) {
      case 'parent':
        // Make the new person a parent of the source
        sourcePerson.parents.push(newId);
        newPerson.children.push(formData.sourceId);
        break;
        
      case 'child':
        // Make the new person a child of the source
        sourcePerson.children.push(newId);
        newPerson.parents.push(formData.sourceId);
        break;
        
      case 'partner':
        // Create a partnership relationship
        sourcePerson.partners.push(newId);
        newPerson.partners.push(formData.sourceId);
        break;
        
      case 'sibling':
        // Make the new person a sibling by giving them the same parents
        for (const parentId of sourcePerson.parents) {
          const parent = peopleDatabase[parentId];
          if (parent) {
            parent.children.push(newId);
            newPerson.parents.push(parentId);
          }
        }
        break;
    }
    
    // Update the database with both modified people
    setPeopleDatabase(prev => ({
      ...prev,
      [formData.sourceId]: sourcePerson,
      [newId]: newPerson
    }));
    
    // Reset form and close modal
    setIsCreatingLink(false);
  };

  // Handle various UI events
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCreateLinkClick = () => {
    setIsCreatingLink(true);
    if (selectedNode) {
      setLinkFormData(prev => ({
        ...prev,
        sourceId: selectedNode.id,
        sourceName: selectedNode.name
      }));
    } else {
      // Reset form if no node is selected
      setLinkFormData({
        sourceId: '',
        sourceName: '',
        targetName: '',
        targetGender: 'male',
        targetBirthDate: '',
        targetBirthPlace: '',
        relationshipType: 'child'
      });
    }
  };

  const handleLinkFormChange = (e) => {
    const { name, value } = e.target;
    setLinkFormData(prev => ({ ...prev, [name]: value }));
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

  const handleCancelLinkCreate = () => {
    setIsCreatingLink(false);
  };

  const handleSaveEdit = () => {
    updateUserData(editForm);
    setIsEditing(false);
    
    // Update the family data with the edited information
    setFamilyData(prev => ({
      ...prev,
      name: editForm.userName,
      gender: editForm.gender,
      birthDate: editForm.birthDate,
      birthPlace: editForm.birthPlace,
      profileImage: editForm.profileImage
    }));
    
    // Also update in the people database
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
      
      {/* Create Family Link Form */}
      {isCreatingLink && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              {linkFormData.sourceId ? 
                `Créer un lien familial à partir de ${linkFormData.sourceName}` : 
                'Créer un lien familial'}
            </h2>
            
            <div className="space-y-4">
              {!linkFormData.sourceId && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  Vous n'avez pas sélectionné de personne source. Veuillez d'abord sélectionner une personne dans l'arbre, ou remplir les informations de la source ci-dessous.
                </div>
              )}
              
              {!linkFormData.sourceId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la source
                  </label>
                  <select
                    name="sourceId"
                    value={linkFormData.sourceId}
                    onChange={handleLinkFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner une personne</option>
                    {Object.entries(peopleDatabase).map(([id, person]) => (
                      <option key={id} value={id}>{person.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de relation
                </label>
                <select
                  name="relationshipType"
                  value={linkFormData.relationshipType}
                  onChange={handleLinkFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="parent">Parent (la cible est parent de la source)</option>
                  <option value="child">Enfant (la cible est enfant de la source)</option>
                  <option value="partner">Conjoint(e) (la cible est conjoint(e) de la source)</option>
                  <option value="sibling">Frère/Sœur (la cible est frère/sœur de la source)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la cible
                </label>
                <input
                  type="text"
                  name="targetName"
                  value={linkFormData.targetName}
                  onChange={handleLinkFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nom de la personne à ajouter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre de la cible
                </label>
                <select
                  name="targetGender"
                  value={linkFormData.targetGender}
                  onChange={handleLinkFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance (optionnel)
                </label>
                <input
                  type="text"
                  name="targetBirthDate"
                  placeholder="AAAA-MM-JJ"
                  value={linkFormData.targetBirthDate}
                  onChange={handleLinkFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance (optionnel)
                </label>
                <input
                  type="text"
                  name="targetBirthPlace"
                  value={linkFormData.targetBirthPlace}
                  onChange={handleLinkFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelLinkCreate}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={() => createFamilyLink(linkFormData)}
                disabled={!linkFormData.sourceId || !linkFormData.targetName}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  !linkFormData.sourceId || !linkFormData.targetName
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Créer le lien
              </button>
            </div>
          </div>
        </div>
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
              <h3 className="font-bold text-gray-800">{selectedNode.name || 'Inconnu'}</h3>
              <p className="text-xs text-gray-500">
                {selectedNode.relationship ? (
                  selectedNode.relationship === 'parent' ? 
                    selectedNode.gender === 'male' ? 'Père' : 'Mère' :
                  selectedNode.relationship === 'partner' ? 'Conjoint(e)' :
                  selectedNode.relationship === 'child' ? 'Enfant' : 
                  selectedNode.relationship === 'grandparent' ? 
                    selectedNode.gender === 'male' ? 'Grand-père' : 'Grand-mère' : ''
                ) : (
                  'Vous'
                )}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-sm">
            {selectedNode.birthDate && (
              <div>
                <span className="font-medium text-gray-700">Date de naissance:</span>{' '}
                <span className="text-gray-600">{selectedNode.birthDate}</span>
              </div>
            )}
            
            {selectedNode.birthPlace && (
              <div>
                <span className="font-medium text-gray-700">Lieu de naissance:</span>{' '}
                <span className="text-gray-600">{selectedNode.birthPlace}</span>
              </div>
            )}
            
            <div>
              <span className="font-medium text-gray-700">Genre:</span>{' '}
              <span className="text-gray-600">
                {selectedNode.gender === 'male' ? 'Masculin' : 'Féminin'}
              </span>
            </div>
            
            <div className="font-medium text-gray-700">Relations:</div>
            <ul className="pl-2 text-xs space-y-1">
              {selectedNode.parents && selectedNode.parents.length > 0 && (
                <li className="text-gray-600">
                  {selectedNode.parents.length} parent(s)
                </li>
              )}
              
              {selectedNode.children && selectedNode.children.length > 0 && (
                <li className="text-gray-600">
                  {selectedNode.children.length} enfant(s)
                </li>
              )}
              
              {selectedNode.partners && selectedNode.partners.length > 0 && (
                <li className="text-gray-600">
                  {selectedNode.partners.length} conjoint(s)
                </li>
              )}
              
              {(!selectedNode.parents || selectedNode.parents.length === 0) && 
               (!selectedNode.children || selectedNode.children.length === 0) && 
               (!selectedNode.partners || selectedNode.partners.length === 0) && (
                <li className="text-gray-600 italic">
                  Aucune relation connue
                </li>
              )}
            </ul>
          </div>
          
          <div className="flex space-x-2">
            {selectedNode.type === 'self' && (
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex-1"
              >
                <FaEdit className="mr-1" />
                Modifier
              </button>
            )}
            
            <button
              onClick={handleCreateLinkClick}
              className="flex items-center justify-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-xs font-medium flex-1"
            >
              <FaLink className="mr-1" />
              Lier
            </button>
          </div>
        </div>
      )}

      {/* Add new person button */}
      <button
        onClick={handleCreateLinkClick}
        className="absolute right-4 bottom-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlus />
      </button>
    </div>
  );
}
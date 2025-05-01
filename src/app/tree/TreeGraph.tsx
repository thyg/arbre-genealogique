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

  // Convert our family data structure to a hierarchical structure for d3
  const createHierarchicalData = () => {
    const processedNodes = new Set();
    
    const processPerson = (personId) => {
      if (!personId || processedNodes.has(personId)) return null;
      
      const person = peopleDatabase[personId];
      if (!person) return null;
      
      processedNodes.add(personId);
      
      const result = { ...person };
      const hierarchicalChildren = [];
      
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
      
      if (result.type === 'self' || !result.relationship) {
        for (const parentId of result.parents || []) {
          const parent = peopleDatabase[parentId];
          if (parent) {
            const parentCopy = { 
              ...parent, 
              relationship: 'parent',
              hierarchicalChildren: []
            };
            
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
    
    const hierarchicalData = createHierarchicalData();
    if (!hierarchicalData) return;
    
    const root = d3.hierarchy(hierarchicalData, d => d.hierarchicalChildren);
    
    const treeLayout = d3.tree()
      .nodeSize([nodeWidth, nodeHeight])
      .separation((a, b) => {
        if (a.data.relationship === 'partner' && b.data.relationship === 'partner') {
          return 1.2;
        } else if (a.data.relationship === 'parent' && b.data.relationship === 'parent') {
          return 1.5;
        } else {
          return 2;
        }
      });
    
    const treeData = treeLayout(root);
    
    treeData.descendants().forEach(d => {
      if (d.data.relationship === 'parent' || d.data.relationship === 'grandparent') {
        d.y = d.y - 100;
      } else if (d.data.relationship === 'partner') {
        d.y = d.parent.y;
      } else if (d.data.relationship === 'child') {
        d.y = d.y + 50;
      }
    });
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left + width/4},${margin.top})`);
    
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        if (d.target.data.relationship === 'partner') {
          return `M ${d.source.x} ${d.source.y} H ${d.target.x}`;
        } else {
          return d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)(d);
        }
      })
      .attr('stroke', d => {
        if (d.target.data.relationship === 'partner') {
          return '#9333ea';
        } else if (d.target.data.relationship === 'child') {
          return '#4f46e5';
        } else {
          return '#059669';
        }
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-dasharray', d => 
        d.target.data.relationship === 'partner' ? '5,5' : 'none'
      );
    
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
      });
    
    nodes.append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => {
        if (d.data.type === 'self') {
          return d.data.gender === 'male' ? '#bfdbfe' : '#fbcfe8';
        }
        return d.data.gender === 'male' ? '#dbeafe' : '#fce7f3';
      })
      .attr('stroke', d => {
        if (selectedNode && selectedNode.id === d.data.id) {
          return '#000';
        }
        return d.data.gender === 'male' ? '#3b82f6' : '#ec4899';
      })
      .attr('stroke-width', d => selectedNode && selectedNode.id === d.data.id ? 3 : 1)
      .attr('opacity', 0.8);
    
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
    
    nodes.filter(d => !d.data.profileImage)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('y', -10)
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '14px')
      .attr('fill', '#fff')
      .text('\uf007');
    
    nodes.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(d => {
        const name = d.data.name || 'Inconnu';
        return name.length > 15 ? name.substring(0, 12) + '...' : name;
      })
      .style('font-size', '12px')
      .style('fill', '#333');
    
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
    
    const initialScale = 0.8;
    const initialX = width / 2 - treeData.x * initialScale;
    const initialY = height / 3 - treeData.y * initialScale;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));
  };

  const createFamilyLink = (sourceId, targetData, relationshipType) => {
    if (!sourceId || !targetData || !relationshipType) return;
    
    if (targetData.id) {
      const sourcePerson = peopleDatabase[sourceId];
      const targetPerson = peopleDatabase[targetData.id];
      
      if (!sourcePerson || !targetPerson) return;
      
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
      }
      
      setPeopleDatabase(prev => ({
        ...prev,
        [sourceId]: sourcePerson,
        [targetData.id]: targetPerson
      }));
    } else {
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
        partners: []
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

function LinkCreationModal({ mode, sourcePerson, peopleDatabase, onClose, onSubmit }) {
  const [relationType, setRelationType] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [existingPersonId, setExistingPersonId] = useState('');
  const [useExistingPerson, setUseExistingPerson] = useState(false);
  const [existingPeopleOptions, setExistingPeopleOptions] = useState([]);

  useEffect(() => {
    const options = Object.values(peopleDatabase).filter(person => {
      if (person.id === sourcePerson?.id) return false;
      if (sourcePerson) {
        if (sourcePerson.parents?.includes(person.id)) return false;
        if (sourcePerson.children?.includes(person.id)) return false;
        if (sourcePerson.partners?.includes(person.id)) return false;
      }
      return true;
    });
    setExistingPeopleOptions(options);
  }, [peopleDatabase, sourcePerson]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let targetData;
    if (useExistingPerson && existingPersonId) {
      const existingPerson = peopleDatabase[existingPersonId];
      targetData = {
        id: existingPerson.id,
        name: existingPerson.name,
        gender: existingPerson.gender,
        birthDate: existingPerson.birthDate,
        birthPlace: existingPerson.birthPlace,
        profileImage: existingPerson.profileImage
      };
    } else {
      targetData = {
        name,
        gender,
        birthDate,
        birthPlace,
        profileImage
      };
    }
    
    const sourceId = sourcePerson ? sourcePerson.id : '1';
    
    onSubmit(sourceId, targetData, relationType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === 'fromSelected' ? `Créer un lien depuis ${sourcePerson?.name}` : 'Créer un nouveau lien familial'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de relation
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="parent">Parent</option>
              <option value="child">Enfant</option>
              <option value="partner">Conjoint(e)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {useExistingPerson ? 'Personne existante' : 'Nouvelle personne'}
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setUseExistingPerson(false)}
                className={`px-3 py-1 rounded-md text-sm ${!useExistingPerson ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Nouvelle
              </button>
              <button
                type="button"
                onClick={() => setUseExistingPerson(true)}
                disabled={existingPeopleOptions.length === 0}
                className={`px-3 py-1 rounded-md text-sm ${useExistingPerson ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} ${existingPeopleOptions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Existante ({existingPeopleOptions.length})
              </button>
            </div>
          </div>
          
          {useExistingPerson ? (
            <div>
              <select
                value={existingPersonId}
                onChange={(e) => setExistingPersonId(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionnez une personne</option>
                {existingPeopleOptions.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.gender === 'male' ? 'Homme' : 'Femme'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div 
                    className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
                    onClick={() => document.getElementById('profileImage').click()}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={!useExistingPerson}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required={!useExistingPerson}
                      />
                      <span className="ml-2 text-sm text-gray-700">Masculin</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Féminin</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Paris, France"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer le lien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
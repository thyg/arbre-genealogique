'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Person } from '@/types/personTypes';
import { FamilyLink } from '@/types/linkTypes';
import ZoomControl from './zoom';
import DragAndDrop from './glissezdeplacer';
import CreateLink from './createlink';
import Recherche from './recherche';
import PersonneComponent from './personnecomponent';

interface TreeGraphProps {
  persons: Person[];
  links: FamilyLink[];
  onSelectPerson: (personId: number) => void;
  onCreateLink: (link: FamilyLink) => void;
  onDeleteLink: (linkId: number) => void;
  onUpdateLink: (link: FamilyLink) => void;
}

const TreeGraph: React.FC<TreeGraphProps> = ({
  persons,
  links,
  onSelectPerson,
  onCreateLink,
  onDeleteLink,
  onUpdateLink
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [sourcePersonId, setSourcePersonId] = useState<number | null>(null);

  useEffect(() => {
    if (!svgRef.current || persons.length === 0) return;

    // Configuration de D3
    const width = containerRef.current?.clientWidth || 1000;
    const height = containerRef.current?.clientHeight || 800;

    // Nettoyage du SVG existant
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Création du groupe principal pour la transformation (zoom/pan)
    const g = svg.append('g');
    
    // Configuration des forces de simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(150).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Préparation des données pour D3
    const nodesData = persons.map(person => ({
      ...person,
      radius: 40,
    }));

    const linksData = links.map(link => ({
      ...link,
      source: link.id_source,
      target: link.id_target,
    }));

    // Dessin des liens
    const linkElements = g.append('g')
      .selectAll('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.8)
      .attr('marker-end', (d) => `url(#arrow-${d.relationType})`)
      .on('click', (event, d) => {
        // Afficher un menu contextuel pour modifier ou supprimer le lien
        event.stopPropagation();
        console.log('Link clicked', d);
      });

    // Création des marqueurs de flèche pour différents types de relations
    const relationTypes = [...new Set(linksData.map(d => d.relationType))];
    
    const defs = svg.append('defs');
    
    relationTypes.forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', getRelationColor(type as string))
        .attr('d', 'M0,-5L10,0L0,5');
    });

    // Dessin des noeuds (personnes)
    const nodeGroups = g.append('g')
      .selectAll('.node')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedPerson(d);
        onSelectPerson(d.id);
      })
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        setSourcePersonId(d.id);
        setShowCreateLinkModal(true);
      });

    // Cercle pour chaque personne
    nodeGroups.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.gender === 'MALE' ? '#b1cbf5' : '#f5b1e9')
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    // Texte pour le nom de la personne
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .text(d => `${d.firstName} ${d.lastName}`)
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .each(function(d) {
        const text = d3.select(this);
        const words = `${d.firstName} ${d.lastName}`.split(' ');
        
        text.text(null);
        
        if (words.length === 1) {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '0em')
            .text(words[0]);
        } else {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '-0.6em')
            .text(words[0]);
          
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .text(words[1]);
        }
      });

    // Mise à jour des positions lors de la simulation
    simulation.nodes(nodesData).on('tick', () => {
      linkElements
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      nodeGroups
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    simulation.force<d3.ForceLink<any, any>>('link')!.links(linksData);

    // Configuration du zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    
    // Centrer et ajuster le zoom initial
    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.7);
    svg.call(zoom.transform, initialTransform);

    // Fonctions pour le drag and drop
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [persons, links, onSelectPerson]);

  // Fonction pour déterminer la couleur en fonction du type de relation
  function getRelationColor(relationType: string): string {
    const colors: { [key: string]: string } = {
      'SON': '#4CAF50',
      'DAUGHTER': '#E91E63',
      'FATHER': '#2196F3',
      'MOTHER': '#9C27B0',
      'HUSBAND': '#3F51B5',
      'WIFE': '#F44336',
      'BROTHER': '#FF9800',
      'SISTER': '#FFEB3B',
      'NEPHEW': '#00BCD4',
      'NIECE': '#CDDC39',
      'GRANDFATHER': '#795548',
      'GRANDMOTHER': '#607D8B'
    };
    
    return colors[relationType] || '#999999';
  }

  const toggleSearchPopup = () => {
    setShowSearch(!showSearch);
  };

  const handleSelectFromSearch = (person: Person) => {
    setShowSearch(false);
    onSelectPerson(person.id);
    
    // Trouver la personne dans le graphique et centrer sur elle
    if (svgRef.current) {
      const node = d3.select(svgRef.current).select(`.node[data-id="${person.id}"]`);
      if (!node.empty()) {
        const bbox = (node.node() as SVGGElement).getBBox();
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        
        const transform = d3.zoomIdentity
          .translate(width / 2 - bbox.x - bbox.width / 2, height / 2 - bbox.y - bbox.height / 2)
          .scale(1.5);
          
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call((d3.zoom<SVGSVGElement, unknown>() as any).transform, transform);
      }
    }
  };

  const handleCreateLink = (targetPersonId: number, relationType: string) => {
    if (sourcePersonId) {
      // Appel à l'API pour créer un lien
      fetch('http://localhost:8030/api/family-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relationType: relationType,
          id_source: sourcePersonId,
          id_target: targetPersonId,
          familyTreeId: 1, // Remplacer par l'ID de l'arbre actuel
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la création du lien');
        }
        return response.json();
      })
      .then(data => {
        onCreateLink(data.data);
        setShowCreateLinkModal(false);
        setSourcePersonId(null);
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Impossible de créer le lien');
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button 
          onClick={toggleSearchPopup}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <ZoomControl svgRef={svgRef} />
      </div>
      
      {showSearch && (
        <div className="absolute top-14 right-4 w-72 bg-white shadow-lg rounded-lg z-20">
          <Recherche onSelectPerson={handleSelectFromSearch} persons={persons} />
        </div>
      )}
      
      {selectedPerson && (
        <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <PersonneComponent person={selectedPerson} onClose={() => setSelectedPerson(null)} />
        </div>
      )}
      
      {showCreateLinkModal && sourcePersonId && (
        <CreateLink 
          sourcePerson={persons.find(p => p.id === sourcePersonId)!}
          persons={persons.filter(p => p.id !== sourcePersonId)}
          onCreateLink={handleCreateLink}
          onClose={() => {
            setShowCreateLinkModal(false);
            setSourcePersonId(null);
          }}
        />
      )}
      
      <svg ref={svgRef} className="w-full h-full"></svg>
      
      <DragAndDrop svgRef={svgRef} />
    </div>
  );
};

export default TreeGraph;
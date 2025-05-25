// src/app/tree/components/TreeGraph.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useParams } from 'next/navigation';
import { getTreeMembers, TreeMember } from '@/app/lib/api';
import ZoomControl from './zoom';
import DragAndDrop from './glissezdeplacer';
import CreateLinkModal, { CreateLinkButton } from './createlink';
import Recherche from './recherche';
import PersonNode from './personnecomponent';
import type { Person } from '../types/person';
import type { FamilyLink, RelationType } from '../types/linkTypes';

interface TreeGraphProps {
  persons: Person[];
  links: FamilyLink[];
  onSelectPerson: (personId: number) => void;
  onCreateLink: (link: FamilyLink) => void;
  onDeleteLink: (linkId: number) => void;
  onUpdateLink: (link: FamilyLink) => void;
}

type NodeDatum = d3.SimulationNodeDatum & { id: string };
type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & { type: RelationType };

export default function TreeGraph({ persons, links = [], onSelectPerson, onCreateLink, onDeleteLink, onUpdateLink }: TreeGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { treeId } = useParams() as { treeId: string };

  const [showSearch, setShowSearch] = useState(false);
  const [modalSource, setModalSource] = useState<Person | null>(null);
  const [floatingCreate, setFloatingCreate] = useState(false);
  const [members, setMembers] = useState<TreeMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [errorMembers, setErrorMembers] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const width = containerRef.current?.clientWidth ?? 800;
  const height = containerRef.current?.clientHeight ?? 600;

  // Chargement des membres
  useEffect(() => {
    setLoadingMembers(true);
    getTreeMembers(treeId)
      .then(data => setMembers(data))
      .catch(err => setErrorMembers(err.message))
      .finally(() => setLoadingMembers(false));
  }, [treeId]);

  // Simulation D3 et rendu des liens
  useEffect(() => {
    if (!svgRef.current || persons.length === 0) return;
    
 console.log('Drawing D3 graph. Persons:', persons, 'Links:', links); // Vérifiez les props ici

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const d3Nodes: NodeDatum[] = persons.map(p => ({ id: String(p.id) }));
    const d3Links: LinkDatum[] = links.map(l => ({
      source: String(l.id_source),
      target: String(l.id_target),
      type:   l.relationType,
    })) as LinkDatum[];

    console.log('d3Links:', d3Links); // **TRÈS IMPORTANT À VÉRIFIER**

    // Dessin des liens sous forme de lignes SVG
    const linkSel = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(d3Links)
      .enter()
      .append('line')
      .attr('stroke', '#000')
      .attr('stroke-width', 10);
console.log('linkSel enter selection size:', linkSel.size()); // Devrait être > 0 si d3Links a des éléments

    // Force simulation
    const simulation = d3.forceSimulation<NodeDatum>(d3Nodes)
      // Liens avec distance variable
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(d3Links)
        .id(d => d.id)
        .distance(link => {
          switch (link.type) {
            case 'MOTHER':
            case 'FATHER':   return 200;
            case 'BROTHER':
            case 'SISTER':   return 100;
            case 'UNCLE':
            case 'AUNT':     return 160;
            case 'COUSIN':   return 200;
            default:         return 150;
          }
        })
        .strength(1)
      )
      // Puissante répulsion pour espacer
      .force('charge', d3.forceManyBody().strength(-5000))
      // Centre
      .force('center', d3.forceCenter(width / 2, height / 2))
      // Eviter le chevauchement
      .force('collide', d3.forceCollide(180))
      // Maintenir position initiale légèrement
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alpha(1)
      .alphaDecay(0.05)
      .on('tick', () => {
        // Mettre à jour la position des liens
        linkSel
          .attr('x1', d => (d.source as NodeDatum).x!)
          .attr('y1', d => (d.source as NodeDatum).y!)
          .attr('x2', d => (d.target as NodeDatum).x!)
          .attr('y2', d => (d.target as NodeDatum).y!);

        // On met à jour positions pour PersonNode
        setPositions(
          d3Nodes.reduce((acc, node) => {
            acc[node.id] = { x: node.x!, y: node.y! };
            return acc;
          }, {} as Record<string, { x: number; y: number }>)
        );
      });
// ← Ici, on « ré-chauffe » et relance la simulation
  simulation.alpha(1).restart();


    // arrêt simulation
    return () => {
  simulation.stop();
};
  }, [persons, links, width, height]);

  return (
    <div ref={containerRef} className="relative w-full h-full p-4 bg-gray-50 rounded">
      {/* Contrôles */}
      <div className="absolute top-4 right-4 flex space-x-2 z-20">
        <button onClick={() => setShowSearch(v => !v)} className="p-2 bg-blue-600 text-white rounded-full shadow" aria-label="Rechercher">🔍</button>
        <ZoomControl svgRef={svgRef as React.RefObject<SVGSVGElement>} width={width} height={height} />
      </div>

      {/* Popup Recherche */}
      {showSearch && (
        <div className="absolute top-12 right-4 bg-white p-4 rounded shadow-lg z-30">
          <Recherche treeId={treeId} onClose={() => setShowSearch(false)} refreshTree={() => {}} />
        </div>
      )}

      {/* Liste des membres */}
      <div className="mt-16">
        {loadingMembers && <p>Charging…</p>}        
        {errorMembers && <p className="text-red-600">{errorMembers}</p>}
        {!loadingMembers && !errorMembers && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map(m => (
              <li key={m.id} className="bg-white p-3 rounded shadow text-center">{m.userName}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Vos modals de création de lien */}
      {modalSource && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={modalSource}
          onLinkCreated={link => { setModalSource(null); onCreateLink(link); }}
          onClose={() => setModalSource(null)}
        />
      )}
      {floatingCreate && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={null}
          onLinkCreated={link => { setFloatingCreate(false); onCreateLink(link); }}
          onClose={() => setFloatingCreate(false)}
        />
      )}
      <CreateLinkButton onClick={() => setFloatingCreate(true)} />

     
      {/* Rendu des PersonNode */}
      {persons.map(person => {
        const pos = positions[String(person.id)] || { x: width/2, y: height/2 };
        return (
          <PersonNode
            key={person.id}
            person={person}
            x={pos.x}
            y={pos.y}
            highlighted={false}
            onClick={() => onSelectPerson(person.id)}
            onContextMenu={() => setModalSource(person)}
          />
        );
      })}

 {/* SVG pour les liens */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" />


      {/* Drag & Drop helper */}
      <DragAndDrop svgRef={svgRef as React.RefObject<SVGSVGElement>} />
    </div>
  );
}

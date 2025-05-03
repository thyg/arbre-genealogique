// src/app/tree/components/treegraph.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useParams } from 'next/navigation';
import { Person } from '../types/person';
import { FamilyLink } from '../types/linkTypes';
import ZoomControl from './zoom';
import DragAndDrop from './glissezdeplacer';
import CreateLinkModal, { CreateLinkButton } from './createlink';
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

export default function TreeGraph({
  persons,
  links,
  onSelectPerson,
  onCreateLink,
  onDeleteLink,
  onUpdateLink,
}: TreeGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Récupération du treeId depuis l'URL
  const { treeId } = useParams() as { treeId: string };

  const [showSearch, setShowSearch] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [sourcePersonId, setSourcePersonId] = useState<number | null>(null);
  const [showFloatingCreateLink, setShowFloatingCreateLink] = useState(false);

  useEffect(() => {
    if (!svgRef.current || persons.length === 0) return;

    const width = containerRef.current?.clientWidth || 1000;
    const height = containerRef.current?.clientHeight || 800;

    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    const g = svg.append('g');

    // ... configuration de la simulation et rendu du graphe (identique à l'existant) ...

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', event => g.attr('transform', event.transform));

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.7));

    return () => {
      // arrêt de la simulation si nécessaire
    };
  }, [persons, links, onSelectPerson]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* Contrôles en haut à droite */}
      <div className="absolute top-10 right-10 z-50 flex space-x-2">
        <button
          onClick={() => setShowSearch(v => !v)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
          aria-label="Rechercher"
          title="Rechercher"
        >🔍</button>
        <ZoomControl svgRef={svgRef as React.RefObject<SVGSVGElement>} />
      </div>

      {showSearch && (
        <div className="absolute top-3 right-3 w-150 bg-white shadow-lg rounded-lg z-40">
          <Recherche
            treeId={treeId}
            onClose={() => setShowSearch(false)}
            refreshTree={() => {/* recharger les données si nécessaire */}}
          />
        </div>
      )}

      {selectedPerson && (
        <div className="absolute bottom-4 left-4 z-30 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <PersonneComponent
            personId={selectedPerson.id}
            onClose={() => setSelectedPerson(null)}
          />
        </div>
      )}

      {showCreateLinkModal && sourcePersonId !== null && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={persons.find(p => p.id === sourcePersonId) || null}
          onLinkCreated={() => {
            setShowCreateLinkModal(false);
            onCreateLink(/* récupérer ou rafraichir le lien créé */ {} as FamilyLink);
          }}
          onClose={() => {
            setShowCreateLinkModal(false);
            setSourcePersonId(null);
          }}
        />
      )}

      {showFloatingCreateLink && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={null}
          onLinkCreated={() => setShowFloatingCreateLink(false)}
          onClose={() => setShowFloatingCreateLink(false)}
        />
      )}

      <CreateLinkButton onClick={() => setShowFloatingCreateLink(true)} />

      <svg ref={svgRef} className="w-full h-full" />
      <DragAndDrop svgRef={svgRef as React.RefObject<SVGSVGElement>} />
    </div>
  );
}
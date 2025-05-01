// components/TreeViewer.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FaPlus } from 'react-icons/fa';
import './TreeViewer.css';

export type Member = {
  id: number;
  name: string;
  birthDate?: string;
  sex?: string;
  birthPlace?: string;
  children?: Member[];
};

export type Tree = {
  members: Member[];
};

interface Props {
  tree: Tree;
  onSelect?: (m: Member) => void;
  onAdd?: (
    type: 'father' | 'mother' | 'sibling' | 'spouse' | 'child',
    parentId: number
  ) => void;
}

// Type pour D3 : children toujours défini
type GraphNode = {
  id: number;
  name: string;
  children: GraphNode[];
};

export default function TreeViewer({ tree, onSelect, onAdd }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svgSel = d3.select(svgRef.current);
    svgSel.selectAll('*').remove();
    svgSel.attr('viewBox', `0 0 ${width} ${height}`);

    // La racine : premier membre
    const rootMember = tree.members[0];
    if (!rootMember) return;

    // Convertir en GraphNode (children toujours au moins [])
    const rootData: GraphNode = {
      id: rootMember.id,
      name: rootMember.name,
      children: rootMember.children?.map(c => ({
        id: c.id,
        name: c.name,
        children: c.children?.map(gc => ({
          id: gc.id,
          name: gc.name,
          children: []
        })) || []
      })) || []
    };

    // Hiérarchie D3
    const hierarchy = d3.hierarchy<GraphNode>(rootData, d => d.children);

    if (rootData.children.length > 0) {
      // Layout arbre si on a des enfants
      const layout = d3.tree<GraphNode>().size([height - 100, width - 100]);
      const treeRoot = layout(hierarchy) as d3.HierarchyPointNode<GraphNode>;

      // Liens
      svgSel.append('g')
        .selectAll('path')
        .data(treeRoot.links())
        .join('path')
        .attr(
          'd',
          d3.linkHorizontal<d3.HierarchyPointLink<GraphNode>, d3.HierarchyPointNode<GraphNode>>()
            .x(d => d.y + 50)
            .y(d => d.x + 50)
        )
        .attr('fill', 'none')
        .attr('stroke', '#bbb');

      // Nœuds
      svgSel.append('g')
        .selectAll('circle')
        .data(treeRoot.descendants())
        .join('circle')
        .attr('cx', d => d.y + 50)
        .attr('cy', d => d.x + 50)
        .attr('r', d => (d.data.id === rootData.id ? 30 : 20))
        .attr('fill', d => (d.data.id === rootData.id ? '#69b3a2' : '#8dc3b8'))
        .style('cursor', 'pointer')
        .on('click', (_, d) => {
          if (d.data.id !== rootData.id && onSelect) {
            const m = findMemberById(tree.members, d.data.id);
            if (m) onSelect(m);
          }
        });

      // Labels
      svgSel.append('g')
        .selectAll('text')
        .data(treeRoot.descendants())
        .join('text')
        .attr('x', d => d.y + 50)
        .attr('y', d => d.x + 54)
        .text(d => d.data.name)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px');

      // Calcul du centre sur le root
      setCenter({ x: treeRoot.x + 50, y: treeRoot.y + 50 });
    } else {
      // Pas d'enfants → cercle au centre
      const cx = width / 2;
      const cy = height / 2;
      svgSel.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 30)
        .attr('fill', '#69b3a2')
        .style('cursor', 'pointer')
        .on('click', () => onSelect?.(rootMember));
      svgSel.append('text')
        .attr('x', cx)
        .attr('y', cy + 4)
        .text(rootMember.name)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '12px');

      setCenter({ x: cy, y: cx });
    }
  }, [tree, onSelect]);

  // Position relative des boutons autour du centre
  const btns = [
    { type: 'father', dx: 0, dy: -70 },
    { type: 'mother', dx: 60, dy: -60 },
    { type: 'sibling', dx: -70, dy: 0 },
    { type: 'spouse', dx: 70, dy: 0 },
    { type: 'child', dx: 0, dy: 70 }
  ] as const;

  return (
    <div ref={containerRef} className="tree-container relative">
      <svg ref={svgRef} className="w-full h-full bg-white rounded shadow" />
      {btns.map(({ type, dx, dy }) => (
        <button
          key={type}
          className="add-btn"
          style={{ top: center.x + dy, left: center.y + dx }}
          aria-label={`Ajouter ${type}`}
          title={`Ajouter ${type}`}
          onClick={() => onAdd?.(type, tree.members[0].id)}
        >
          <FaPlus />
        </button>
      ))}
    </div>
  );
}

// Helper corrigé : compare m.id === id
function findMemberById(list: Member[], id: number): Member | undefined {
  for (const m of list) {
    if (m.id === id) return m;
    if (m.children) {
      const found = findMemberById(m.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

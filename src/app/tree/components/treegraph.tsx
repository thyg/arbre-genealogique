// src/app/tree/components/TreeGraph.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useParams } from "next/navigation";

import { getTreeMembers, type TreeMember, getFamilyLinks } from "@/app/lib/api";
import ZoomControl from "./zoom";
import DragAndDrop from "./glissezdeplacer";
import CreateLinkModal, { CreateLinkButton } from "./createlink";
import Recherche from "./recherche";
import PersonNode from "./personnecomponent";
import type { Person } from "../types/person";
import type { FamilyLink, RelationType } from "../types/linkTypes";

interface TreeGraphProps {
  persons: Person[];
  onSelectPerson: (personId: number) => void;
  onCreateLink: (link: FamilyLink) => void;
  onDeleteLink: (linkId: number) => void;
  onUpdateLink: (link: FamilyLink) => void;
}

type NodeDatum = d3.SimulationNodeDatum & { id: string };
type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & { type: RelationType };

export default function TreeGraph({
  persons,
  onSelectPerson,
  onCreateLink,
  onDeleteLink,
  onUpdateLink,
}: TreeGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { treeId } = useParams() as { treeId: string };

  const [links, setLinks] = useState<FamilyLink[]>([]);
  const [members, setMembers] = useState<TreeMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [errorMembers, setErrorMembers] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [modalSource, setModalSource] = useState<Person | null>(null);
  const [floatingCreate, setFloatingCreate] = useState(false);

  const width = containerRef.current?.clientWidth ?? 800;
  const height = containerRef.current?.clientHeight ?? 600;

  /* --------------------------------------------------
   * Chargement des personnes + liens depuis le backend
   * -------------------------------------------------- */
  useEffect(() => {
    setLoadingMembers(true);
    Promise.all([
      getTreeMembers(treeId),
      getFamilyLinks(Number(treeId)),
    ])
      .then(([membersRes, linksRes]) => {
        setMembers(membersRes);
        setLinks(linksRes);

        console.log("[TreeGraph] API Response - Members (clone for inspection):", JSON.parse(JSON.stringify(membersRes)));
        console.log("[TreeGraph] API Response - Links (clone for inspection):", JSON.parse(JSON.stringify(linksRes)));



        // 1. Y a-t-il des membres ?
        if (!membersRes || membersRes.length === 0) {
          console.warn("[TreeGraph] Warning: No members received from API.");
        } else {
          console.log(`[TreeGraph] Received ${membersRes.length} members.`);
          // Vérifier la structure du premier membre (s'il existe)
          if (membersRes[0]) {
            console.log("[TreeGraph] First member structure (example):", membersRes[0]);
            // Portez une attention particulière à la propriété qui sert d'ID (ex: 'd', 'memberId', etc.)
            if (typeof membersRes[0].id === 'undefined') { // Adaptez 'id' si le nom est différent
                console.warn("[TreeGraph] Warning: First member does not seem to have an 'id' property. Check the actual ID field name.");
            }
          }
        }

        // 2. Y a-t-il des liens ?
        if (!linksRes || linksRes.length === 0) {
          console.warn("[TreeGraph] Warning: No links received from API.");
        } else {
          console.log(`[TreeGraph] Received ${linksRes.length} links.`);
          // Vérifier la structure du premier lien (s'il existe)
          if (linksRes[0]) {
            console.log("[TreeGraph] First link structure (example):", linksRes[0]);
            // Portez attention à 'id_source' et 'id_target'
             if (typeof linksRes[0].id_source === 'undefined' || typeof linksRes[0].id_target === 'undefined') {
                console.warn("[TreeGraph] Warning: First link does not seem to have 'id_source' or 'id_target' properties.");
            }
          }
        }

        // 3. Les IDs des liens correspondent-ils aux IDs des membres ?
        if (membersRes && membersRes.length > 0 && linksRes && linksRes.length > 0) {
          const memberIds = new Set(membersRes.map(m => String(m.id))); // Adaptez 'm.id' si le nom du champ ID est différent
          console.log("[TreeGraph] Member IDs extracted for matching:", Array.from(memberIds));

          let foundAtLeastOneMatchingLink = false;
          let linksWithUnmatchedSources = 0;
          let linksWithUnmatchedTargets = 0;

          linksRes.forEach((link, index) => {
            const sourceExists = memberIds.has(String(link.id_source));
            const targetExists = memberIds.has(String(link.id_target));

            if (sourceExists && targetExists) {
              foundAtLeastOneMatchingLink = true;
            } else {
              if (!sourceExists) {
                linksWithUnmatchedSources++;
                console.warn(`[TreeGraph] Link ${index} (source: ${link.id_source}, target: ${link.id_target}): Source ID ${link.id_source} NOT FOUND in members.`);
              }
              if (!targetExists) {
                linksWithUnmatchedTargets++;
                console.warn(`[TreeGraph] Link ${index} (source: ${link.id_source}, target: ${link.id_target}): Target ID ${link.id_target} NOT FOUND in members.`);
              }
            }
          });

          if (foundAtLeastOneMatchingLink) {
            console.log("[TreeGraph] Good: At least one link has matching source and target IDs in the members list.");
          } else {
            console.error("[TreeGraph] CRITICAL: NO links have matching source/target IDs in the fetched members list. Links cannot be drawn correctly.");
          }
          if(linksWithUnmatchedSources > 0) console.warn(`[TreeGraph] Total links with unmatched sources: ${linksWithUnmatchedSources}`);
          if(linksWithUnmatchedTargets > 0) console.warn(`[TreeGraph] Total links with unmatched targets: ${linksWithUnmatchedTargets}`);

        } else if (linksRes && linksRes.length > 0 && (!membersRes || membersRes.length === 0)) {
            console.error("[TreeGraph] CRITICAL: Links were fetched, but no members were fetched. Links cannot be drawn.");
        }
        console.log("-------------------------------------------");
        // --- FIN DES LOGS DE VÉRIFICATION API ---



      })
      .catch((err) => setErrorMembers(err.message))
      .finally(() => setLoadingMembers(false));
  }, [treeId]);

  /* --------------------------------------------------
   * D3 : construire/mettre à jour la simulation
   * -------------------------------------------------- */
  useEffect(() => {
    if (!svgRef.current || persons.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    /* Nœuds */
    const d3Nodes: NodeDatum[] = persons.map((p) => ({ id: String(p.id) }));
    const idSet = new Set(d3Nodes.map((n) => n.id));

    /* Liens : on filtre ceux dont la source OU la cible est manquante → évite l’erreur « node not found: undefined » */
    const validLinks = links.filter(
      (l) => idSet.has(String(l.id_source)) && idSet.has(String(l.id_target))
    );

    const d3Links: LinkDatum[] = validLinks.map((l) => ({
      source: String(l.id_source),
      target: String(l.id_target),
      type: l.relationType,
    })) as LinkDatum[];

    /* Groupe pour les lignes */
    const linkSel = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(d3Links)
      .enter()
      .append("line")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    /* Simulation */
    const simulation = d3.forceSimulation<NodeDatum>(d3Nodes)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(120));

    /* Ajoute la force de lien uniquement si on a des liens valides */
    if (d3Links.length) {
      simulation.force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(d3Links)
          .id((d) => d.id)
          .distance((l) => (l.type === "FATHER" || l.type === "MOTHER" ? 200 : 150))
          .strength(1)
      );
    }

    simulation
      .alpha(1)
      .alphaDecay(0.08)
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
          .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
          .attr("x2", (d) => (d.target as NodeDatum).x ?? 0)
          .attr("y2", (d) => (d.target as NodeDatum).y ?? 0);

        setPositions(
          d3Nodes.reduce((acc, n) => {
            acc[n.id] = { x: n.x ?? 0, y: n.y ?? 0 };
            return acc;
          }, {} as Record<string, { x: number; y: number }>)
        );
      });

    return () => void simulation.stop();
  }, [persons, links, width, height]);

  /* -------------------------------------------------- RENDER */
  return (
    <div ref={containerRef} className="relative w-full h-full p-4 bg-gray-50 rounded overflow-hidden">
      {/* Outils */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={() => setShowSearch((v) => !v)} className="p-2 bg-blue-600 text-white rounded-full shadow" aria-label="Rechercher">
          🔍
        </button>
        <ZoomControl svgRef={svgRef as React.RefObject<SVGSVGElement>} width={width} height={height} />
      </div>

      {showSearch && (
        <div className="absolute top-12 right-4 bg-white p-4 rounded shadow-lg z-30">
          <Recherche treeId={treeId} onClose={() => setShowSearch(false)} refreshTree={() => {}} />
        </div>
      )}

      {/* Liste membres */}
      <div className="mt-16">
        {loadingMembers && <p>Chargement…</p>}
        {errorMembers && <p className="text-red-600">{errorMembers}</p>}
        {!loadingMembers && !errorMembers && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((m) => (
              <li key={m.id} className="bg-white p-3 rounded shadow text-center">{m.userName}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Modales création de lien */}
      {modalSource && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={modalSource}
          onLinkCreated={(link) => {
            setModalSource(null);
            onCreateLink(link);
            setLinks((prev) => [...prev, link]);
          }}
          onClose={() => setModalSource(null)}
        />
      )}
      {floatingCreate && (
        <CreateLinkModal
          familyTreeId={treeId}
          sourcePerson={null}
          onLinkCreated={(link) => {
            setFloatingCreate(false);
            onCreateLink(link);
            setLinks((prev) => [...prev, link]);
          }}
          onClose={() => setFloatingCreate(false)}
        />
      )}
      <CreateLinkButton onClick={() => setFloatingCreate(true)} />

      {/* PersonNodes */}
      {persons.map((person) => {
        const pos = positions[String(person.id)] || { x: width / 2, y: height / 2 };
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

      {/* SVG liens */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Drag & drop helper */}
      <DragAndDrop svgRef={svgRef as React.RefObject<SVGSVGElement>} />
    </div>
  );
}

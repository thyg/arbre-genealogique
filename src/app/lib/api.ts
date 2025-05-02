
// src/app/lib/api.ts

// Base URL du proxy Next.js
const BASE_URL = "/api";

/** Un membre de l’arbre tel qu’on l’utilise dans le front */
export interface TreeMember {
  id:       string;
  userName: string;
}

/** Le format brut renvoyé par GET /persons/family-tree/:treeId */
interface TreeMembersResponse {
  value: string;
  data: Array<{
    id:        number | string;
    firstName: string;
    lastName:  string;
  }>;
}

/**
 * Récupère la liste des membres d’un arbre
 */
export async function getTreeMembers(
  treeId: string
): Promise<TreeMember[]> {
  const res = await fetch(`${BASE_URL}/persons/family-tree/${treeId}`);
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: TreeMembersResponse = await res.json();
  return json.data.map(m => ({
    id:       String(m.id),
    userName: `${m.firstName} ${m.lastName}`.trim(),
  }));
}


/** Étape unique dans le chemin retourné par Dijkstra */
export interface RelationshipStep {
  fromPerson:   string;
  toPerson:     string;
  relationType: string;
}

/** Le format brut renvoyé par GET /family-link/dijkstra?... */
interface GetRelationshipResponse {
  value: string;
  data: {
    path: Array<{
      fromPerson:   string;
      toPerson:     string;
      relationType: string;
      weight:       number;
    }>;
    totalWeight: number;
  };
  text?: string;
}

/**
 * Récupère le plus court chemin (Dijkstra) entre deux IDs de membres.
 * Renvoie un tableau de RelationshipStep et le poids total.
 */
export async function getRelationship(
  startId:      string,
  endId:        string,
  familyTreeId: string
): Promise<{ path: RelationshipStep[]; totalWeight: number }> {
  // Construire l’URL de l’endpoint avec les query params
  const endpoint =
    `${BASE_URL}/family-link/dijkstra` +
    `?startId=${encodeURIComponent(startId)}` +
    `&endId=${encodeURIComponent(endId)}` +
    `&familyTreeId=${encodeURIComponent(familyTreeId)}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: GetRelationshipResponse = await res.json();

  // Transformer le path brut en RelationshipStep[]
  const path: RelationshipStep[] = json.data.path.map(step => ({
    fromPerson:   step.fromPerson,
    toPerson:     step.toPerson,
    relationType: step.relationType,
  }));

  return {
    path,
    totalWeight: json.data.totalWeight,
  };
}

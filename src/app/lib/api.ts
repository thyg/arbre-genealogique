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
  treeId: number
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

/** Payload to create a new family tree */
export interface CreateTreePayload {
  name:             string;
  description:      string;
  geographicOrigin: string;
  creator:          string; 
}

/** Response shape for creating a tree */
interface CreateTreeResponse {
  value: string;
  data: { id: string };
}

/**
 * Crée un nouvel arbre généalogique.
 * Renvoie l’ID de l’arbre créé.
 */
export async function createTree(
  payload: CreateTreePayload
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/family-trees`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: CreateTreeResponse = await res.json();
  return { id: String(json.data.id) };
}

/** Payload to create a new person in an existing tree */
export interface CreatePersonPayload {
  treeId:     string;
  firstName:  string;
  lastName:   string;
  birthDate?: string;
  birthPlace?: string;
  gender?:    string;
}

/** Response shape for creating a person */
interface CreatePersonResponse {
  value: string;
  data: { id: string };
}

/**
 * Crée une nouvelle personne dans un arbre existant.
 * Renvoie l’ID de la personne créée.
 */
export async function createPerson(
  payload: CreatePersonPayload
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/persons`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: CreatePersonResponse = await res.json();
  return { id: String(json.data.id) };
}

/** Payload to create a relationship between two people */
export interface CreateRelationPayload {
  familyTreeId: string;
  fromId:       string;
  toId:         string;
  relationType: string;
  weight?:      number;
}

/** Response shape for creating a relation */
interface CreateRelationResponse {
  value: string;
  data: { id: string };
}

/**
 * Crée un lien (relation) entre deux membres d’un arbre.
 * Renvoie l’ID du lien créé.
 */
export async function createRelation(
  payload: CreateRelationPayload
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/family-link`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: CreateRelationResponse = await res.json();
  return { id: String(json.data.id) };
}


/** Type pour les liens familiaux */
export interface FamilyLink {
  id: number;
  id_source: number;
  id_target: number;
  relationType: string;
}

/** Le format brut renvoyé par GET /family-links/tree/:treeId */
interface FamilyLinksResponse {
  value: string;
  data: FamilyLink[];
}

/**
 * Récupère tous les liens d'un arbre généalogique
 */
export async function getFamilyLinks(
  treeId: string
): Promise<FamilyLink[]> {
  const res = await fetch(`${BASE_URL}/family-links/tree/${treeId}`);
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: FamilyLinksResponse = await res.json();
  return json.data;
}
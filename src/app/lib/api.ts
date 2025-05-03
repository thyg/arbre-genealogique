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

export interface TreeDetails {
  id:                 string;
  name:               string;
  description:        string;
  creationDate:       string;
  lastModifiedDate:   string;
  geographicOrigin:   string;
  creator:            string;
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


/** Shape brute renvoyée par GET /family-trees/:treeId */
interface GetTreeResponse {
  value: string;
  data: {
    id:                 number | string;
    name:               string;
    description:        string;
    creationDate:       string;
    lastModifiedDate:   string;
    geographicOrigin:   string;
    creator:            string;
    // on ignore le reste (people, familyLinks, etc.)
  };
  text?: string;
}


/**
 * Récupère les détails « méta » d’un arbre généalogique.
 */

export async function getTree(treeId: string): Promise<TreeDetails> {
  const res = await fetch(
    `${BASE_URL}/family-trees/${encodeURIComponent(treeId)}`
  );
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: GetTreeResponse = await res.json();
  const d = json.data;
  return {
    id:               String(d.id),
    name:             d.name,
    description:      d.description,
    creationDate:     d.creationDate,
    lastModifiedDate: d.lastModifiedDate,
    geographicOrigin: d.geographicOrigin,
    creator:          d.creator,
  };
}



/** Payload pour mettre à jour une personne existante */
export interface UpdatePersonPayload {
  /** L’ID de la personne (sera placé dans l’URL) */
  id: string;
  /** Champs modifiables — ne pas oublier d’encoder les dates au format ISO si nécessaire */
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: string;
}

/** Shape de la réponse renvoyée par le back pour un update */
interface UpdatePersonResponse {
  value: string;
  data: {
    id:         number | string;
    firstName:  string;
    lastName:   string;
    birthDate?: string;
    birthPlace?: string;
    gender?:    string;
    // … autres champs renvoyés par votre API …
  };
  text?: string;
}

/**
 * Met à jour les informations d’une personne existante.
 * Envoie un PATCH à /api/persons/:id avec le DTO
 * et renvoie l’ID (et potentiellement les données) de la personne mise à jour.
 */
export async function updatePerson(
  payload: UpdatePersonPayload
): Promise<{
  id: string;
  firstName: string;
  lastName:  string;
  birthDate?: string;
  birthPlace?: string;
  gender?:    string;
}> {
  const { id, ...body } = payload;
  const res = await fetch(`${BASE_URL}/persons/${encodeURIComponent(id)}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: UpdatePersonResponse = await res.json();
  return {
    id:         String(json.data.id),
    firstName:  json.data.firstName,
    lastName:   json.data.lastName,
    birthDate:  json.data.birthDate,
    birthPlace: json.data.birthPlace,
    gender:     json.data.gender,
  };
}



/** Un lien sortant/entrant pour une personne */
export interface PersonLink {
  id:           string;
  weight:       number;
  relationType: string;
}

/** Représentation d’une personne dans le front */
export interface Person {
  id:            string;
  firstName:     string;
  lastName:      string;
  birthDate?:    string;
  birthPlace?:   string;
  gender?:       string;
  outgoingLinks: PersonLink[];
  incomingLinks: PersonLink[];
}

/** Shape brute renvoyée par GET /persons/:id */
interface GetPersonResponse {
  value: string;
  data: {
    id:           number | string;
    firstName:    string;
    lastName:     string;
    birthDate?:   string;
    birthPlace?:  string;
    gender?:      string;
    outgoingLinks: Array<{
      id:           number | string;
      weight:       number;
      relationType: string;
    }>;
    incomingLinks: Array<{
      id:           number | string;
      weight:       number;
      relationType: string;
    }>;
  };
  text?: string;
}

/**
 * Récupère les détails d’une personne par son ID.
 */
export async function getPersonById(id: string): Promise<Person> {
  const res = await fetch(
    `${BASE_URL}/persons/${encodeURIComponent(id)}`
  );
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: GetPersonResponse = await res.json();

  const d = json.data;
  return {
    id:            String(d.id),
    firstName:     d.firstName,
    lastName:      d.lastName,
    birthDate:     d.birthDate,
    birthPlace:    d.birthPlace,
    gender:        d.gender,
    outgoingLinks: d.outgoingLinks.map(link => ({
      id:           String(link.id),
      weight:       link.weight,
      relationType: link.relationType,
    })),
    incomingLinks: d.incomingLinks.map(link => ({
      id:           String(link.id),
      weight:       link.weight,
      relationType: link.relationType,
    })),
  };
}








  














////////////////////////creer un lien ///////////////////////////

/** Payload pour créer un lien entre deux personnes avec informations complètes */
export interface CreateRelationWithPersonsPayload {
  familyTreeId: string | number;
  relationType: string;
  source: {
    id?: string;      // Optionnel, si on utilise une personne existante
    firstName: string;
    lastName: string;
    birthDate?: string;
    birthPlace?: string;
    gender?: string;
  };
  target: {
    id?: string;      // Optionnel, si on utilise une personne existante
    firstName: string;
    lastName: string;
    birthDate?: string;
    birthPlace?: string;
    gender?: string;
  };
}

/** Response shape pour la création d'un lien */
interface CreateLinkResponse {
  value: string;
  data: { 
    id: string;
    id_source: string;
    id_target: string;
    relationType: string;
    weight: number;
  };
}

/**
 * Crée un lien entre deux personnes, crée également les personnes si elles n'existent pas
 * Renvoie l'ID du lien créé et les informations associées.
 */
export async function createLink(
  payload: CreateRelationWithPersonsPayload
): Promise<{ 
  id: string;
  id_source: string;
  id_target: string; 
  relationType: string;
  weight: number;
}> {
  // Transformation du payload pour le format attendu par l'API
  const requestPayload = {
    relationType: payload.relationType,
    source: payload.source,
    target: payload.target,
    familyTreeId: payload.familyTreeId
  };

  const res = await fetch(`${BASE_URL}/family-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload),
  });

  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }

  const json: CreateLinkResponse = await res.json();
  
  return {
    id: String(json.data.id),
    id_source: String(json.data.id_source),
    id_target: String(json.data.id_target),
    relationType: json.data.relationType,
    weight: json.data.weight
  };
}




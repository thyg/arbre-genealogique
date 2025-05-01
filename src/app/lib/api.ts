// lib/api.ts

// Base URL of the deployed API
const BASE_URL = '/api';

// Response shape for fetching tree members
interface TreeMembersResponse {
  value: string;
  data: Array<{
    id: number | string;
    firstName: string;
    lastName: string;
  }>;
}

// Fetch all members for a given family-tree ID
export async function getTreeMembers(treeId: string): Promise<{ id: string; userName: string; }[]> {
  const res = await fetch(`${BASE_URL}/persons/family-tree/${treeId}`);
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const json: TreeMembersResponse = await res.json();
  return json.data.map(m => ({
    id: String(m.id),
    userName: `${m.firstName} ${m.lastName}`.trim()
  }));
}

// Response shape for relationship path
/*interface RelationshipResponse {
  value: string;
  path: Array<{
    firstName: string;
    lastName: string;
    relationType: string;
  }>;
}*/

// Fetch relationship path between two member IDs
// lib/api.ts

// … après avoir importé BASE_URL …

export async function getRelationship(
    startId: string,
    endId: string,
    treeId: string
  ): Promise<{ path: { fromPerson: string; toPerson: string; relation: string }[] }> {
    // Construit manuellement la query string
    const endpoint = `${BASE_URL}/family-link/dijkstra`
      + `?startId=${encodeURIComponent(startId)}`
      + `&endId=${encodeURIComponent(endId)}`
      + `&familyTreeId=${encodeURIComponent(treeId)}`;
  
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    const json = await res.json() as {
      value: string;
      data: { path: Array<{ fromPerson: string; toPerson: string; relationType: string }> };
    };
  
    return {
      path: json.data.path.map(step => ({
        fromPerson: step.fromPerson,
        toPerson:   step.toPerson,
        relation:   step.relationType
      }))
    };
  }
  

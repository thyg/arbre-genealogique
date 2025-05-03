export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type RelationType = 
  'FATHER' | 'MOTHER' | 'SON' | 'DAUGHTER' | 
  'BROTHER' | 'SISTER' | 'HUSBAND' | 'WIFE' | 
  'GRANDFATHER' | 'GRANDMOTHER' | 'GRANDSON' | 'GRANDDAUGHTER' |
  'UNCLE' | 'AUNT' | 'NEPHEW' | 'NIECE' | 'COUSIN';

export interface FamilyLink {
  id: number;
  weight: number;
  relationType: RelationType;
  source?: Person;
  target?: Person;
  sourceId?: number;
  targetId?: number;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: string;
  birthPlace?: string;
  gender: Gender;
  outgoingLinks?: FamilyLink[];
  incomingLinks?: FamilyLink[];
}

export interface FamilyTree {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNode extends Person {
  x?: number;
  y?: number;
}

export interface GraphLink {
  id: number;
  source: number;
  target: number;
  relationType: RelationType;
  weight: number;
}
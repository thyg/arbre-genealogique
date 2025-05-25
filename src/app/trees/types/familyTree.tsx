// types/index.ts

export type Gender = 'MALE' | 'FEMALE';

export enum RelationType {
  SON = 'SON',
  DAUGHTER = 'DAUGHTER',
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  BROTHER = 'BROTHER',
  SISTER = 'SISTER',
  HUSBAND = 'HUSBAND',
  WIFE = 'WIFE',
  UNCLE = 'UNCLE',
  AUNT = 'AUNT',
  NEPHEW = 'NEPHEW',
  NIECE = 'NIECE',
  COUSIN = 'COUSIN',
  GRANDFATHER = 'GRANDFATHER',
  GRANDMOTHER = 'GRANDMOTHER',
  GRANDSON = 'GRANDSON',
  GRANDDAUGHTER = 'GRANDDAUGHTER'
}

export interface Person {
  id?: number;
  lastName: string;
  firstName: string;
  birthDate?: string;
  birthPlace?: string;
  gender: Gender;
  outgoingLinks?: FamilyLink[];
}

export interface FamilyLink {
  id?: number;
  weight?: number;
  relationType: RelationType | string;
  id_source?: number;
  target?: Person;
  familyTreeId?: number;
}

export interface FamilyTreeNode {
  id: string;
  name: string;
  gender: string; // 'male' | 'female'
  birthDate?: string;
  birthPlace?: string;
  profileImage?: string;
  type?: string;
  relationship?: string;
  parents: string[];
  children: string[];
  partners: string[];
  specialRelations?: SpecialRelation[];
  level?: number;
  position?: number;
  isFamilyNode?: boolean;
}

export interface SpecialRelation {
  type: string;
  personId: string;
}

export interface UserData {
  profileImage?: string;
  userName?: string;
  treeName?: string;
  gender?: string;
  birthDate?: string;
  birthPlace?: string;
}

export interface EditFormState extends UserData {}

export interface PeopleDatabase {
  [key: string]: FamilyTreeNode;
}

export interface APIResponse<T> {
  value: string;
  data: T;
  text?: string;
}
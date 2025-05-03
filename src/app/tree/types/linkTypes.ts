// types/linkTypes.ts

export type RelationType = 
  | 'SON' 
  | 'DAUGHTER'
  | 'FATHER'
  | 'MOTHER'
  | 'HUSBAND'
  | 'WIFE'
  | 'BROTHER'
  | 'SISTER'
  | 'NEPHEW'
  | 'NIECE'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'UNCLE'
  | 'AUNT'
  | 'COUSIN';

export interface FamilyLink {
  id?: number;
  weight?: number;
  relationType: RelationType;
  id_source: number;
  id_target: number;
  familyTreeId?: number;
}

export interface FamilyLinkCreateRequest {
  relationType: RelationType;
  id_source: number;
  target: {
    lastName: string;
    firstName: string;
    birthDate?: string;
    birthPlace?: string;
    gender: 'MALE' | 'FEMALE';
  };
  familyTreeId: number;
}

export interface FamilyLinkUpdateRequest {
  relationType: RelationType;
}

export interface FamilyLinkResponse {
  value: string;
  data: FamilyLink | null;
  text?: string;
}
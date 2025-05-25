// src/app/signup/types/signup.ts

/**
 * Étape 1: Informations sur l'arbre généalogique
 */
export interface Step1Values {
    /** Nom de l'arbre (ex: Famille Dupont) */
    name: string;
    /** Description ou commentaire optionnel */
    description: string;
    /** Origine géographique (ex: Paris, Cameroun) */
    geographicOrigin: string;
  }
  
  /**
   * Étape 2: Informations sur le premier membre (vous-même)
   */
  export interface Step2Values {
    /** Prénom(s) */
    firstName: string;
    /** Nom de famille */
    lastName: string;
    /** Date de naissance au format YYYY-MM-DD */
    birthDate: string;
    /** Lieu de naissance */
    birthPlace: string;
    /** Sexe: vide jusqu'à sélection, ou masculin/feminin/inconnu */
    gender: '' | 'masculin' | 'feminin' | 'inconnu';
  }
  
  /**
   * Étape 3: Informations pour ajouter une relation familiale
   */
  export interface Step3Values {
    /** Direction de la relation: '' non défini, 'source' = vous êtes la source, 'target' = vous êtes la cible */
    relationDirection: '' | 'source' | 'target';
    /** Type de relation (parent, child, spouse, sibling) */
    relationType: string;
    /** Prénom de la personne liée */
    relatedFirstName: string;
    /** Nom de famille de la personne liée */
    relatedLastName: string;
    /** Date de naissance de la personne liée */
    relatedBirthDate: string;
    /** Lieu de naissance de la personne liée */
    relatedBirthPlace: string;
    /** Sexe de la personne liée */
    relatedGender: '' | 'masculin' | 'feminin';
  }
  
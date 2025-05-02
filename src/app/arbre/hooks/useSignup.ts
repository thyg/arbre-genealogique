// src/app/signup/hooks/useSignup.ts
'use client';

import { useState, useCallback } from 'react';
import { createTree } from '../../lib/api';
import type { Step1Values } from '../components/Step1TreeName';

export default function useSignup() {
  // Valeurs du formulaire (étape 1 uniquement)
  const [values, setValues] = useState<Step1Values>({
    name: '',
    creator: '',            // <— ajouté pour refléter le créateur
    description: '',
    geographicOrigin: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]     = useState<string | null>(null);

  /**
   * Crée l'arbre avec les valeurs du formulaire.
   * Renvoie l'ID de l'arbre ou null en cas d'erreur.
   */
  const create = useCallback(async (): Promise<string | null> => {
    setError(null);
    setLoading(true);
    try {
      const { id } = await createTree({
        name:             values.name,
        creator:          values.creator,
        description:      values.description,
        geographicOrigin: values.geographicOrigin,
      });
      return id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
      return null;
    } finally {
      setLoading(false);
    }
  }, [values]);

  return {
    values,

    // setter générique pour chacun des champs
    setValue: (field: keyof Step1Values, value: string) =>
      setValues(prev => ({ ...prev, [field]: value })),

    loading,
    error,
    create,
  };
}

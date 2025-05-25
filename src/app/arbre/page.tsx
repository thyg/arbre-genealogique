// src/app/arbre/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter }    from 'next/navigation';
import Step1TreeName, { Step1Values } from './components/Step1TreeName';
import { createTree }    from '@/app/lib/api';

export default function CreateTreePage() {
  const router = useRouter();
  const [values, setValues] = useState<Step1Values>({
    name: '',
    creator: '',
    description: '',
    geographicOrigin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string|null>(null);

  const handleChange = (field: keyof Step1Values, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    setError(null);
    setLoading(true);
    try {
      const { id: treeId } = await createTree({
        name:             values.name,
        creator:          values.creator,
        description:      values.description,
        geographicOrigin: values.geographicOrigin,
      });
      // on redirige vers /tree/[treeId]
      router.push(`/tree/${treeId}`);
    } catch (err: any) {
      setError(err.message ?? 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          Créer votre arbre généalogique
        </h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <Step1TreeName
          values={values}
          onChange={handleChange}
          onNext={handleCreate}
        />

        {loading && (
          <p className="mt-4 text-center text-gray-600">Création en cours…</p>
        )}
      </div>
    </div>
  );
}










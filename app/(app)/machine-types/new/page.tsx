'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MachineTypeForm } from '@/components/forms/MachineTypeForm';
import type { MachineTypeCreateInput } from '@/types';

export default function NewMachineTypePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: MachineTypeCreateInput) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/machine-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du type de machine');
      }

      router.push('/machine-types');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    router.push('/machine-types');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Ajouter un type de machine
        </h2>
        <p className="text-secondary-600 mt-1">
          Créer une nouvelle spécification de type de machine CNC
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <MachineTypeForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

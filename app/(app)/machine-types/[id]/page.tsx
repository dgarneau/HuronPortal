'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { MachineTypeForm } from '@/components/forms/MachineTypeForm';
import type { MachineType, MachineTypeUpdateInput } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function MachineTypeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [machineType, setMachineType] = useState<MachineType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    checkRole();
    fetchMachineType();
  }, [params.id]);

  async function checkRole() {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const result = await response.json();
        setIsAdmin(result.data?.role === 'Admin');
      }
    } catch (err) {
      console.error('Failed to check role:', err);
    }
  }

  async function fetchMachineType() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/machine-types/${params.id}`);
      
      if (response.status === 404) {
        notFound();
      }

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du type de machine');
      }
      
      const result = await response.json();
      setMachineType(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate(data: MachineTypeUpdateInput) {
    try {
      setUpdateLoading(true);
      setError(null);

      const response = await fetch(`/api/machine-types/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du type de machine');
      }

      router.push('/machine-types');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
    } finally {
      setUpdateLoading(false);
    }
  }

  function handleCancel() {
    router.push('/machine-types');
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !machineType) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!machineType) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          {isAdmin ? 'Modifier le type de machine' : 'Détails du type de machine'}
        </h2>
        <p className="text-secondary-600 mt-1">
          {machineType.machineTypeName}
        </p>
      </div>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {isAdmin ? (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <MachineTypeForm
            machineType={machineType}
            mode="edit"
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={updateLoading}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 space-y-6">
          {/* Basic Information Section - Read Only */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations de base</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID du type
                </label>
                <p className="text-gray-900 font-mono">{machineType.machineTypeId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du type
                </label>
                <p className="text-gray-900">{machineType.machineTypeName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabricant
              </label>
              <p className="text-gray-900">{machineType.manufacturer}</p>
            </div>

            {machineType.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{machineType.description}</p>
              </div>
            )}
          </div>

          {/* Linear Axes Section - Read Only */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Axes linéaires (Course en mm)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe X
                </label>
                <p className="text-gray-900">{machineType.x} mm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe Y
                </label>
                <p className="text-gray-900">{machineType.y} mm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe Z
                </label>
                <p className="text-gray-900">{machineType.z} mm</p>
              </div>
            </div>
          </div>

          {/* Rotational Axes Section - Read Only */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Axes rotatifs (Rotation totale en degrés)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe A
                </label>
                <p className="text-gray-900">{machineType.a === -1 ? '∞ (infini)' : `${machineType.a}°`}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe B
                </label>
                <p className="text-gray-900">{machineType.b === -1 ? '∞ (infini)' : `${machineType.b}°`}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Axe C
                </label>
                <p className="text-gray-900">{machineType.c === -1 ? '∞ (infini)' : `${machineType.c}°`}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

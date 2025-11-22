'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@/components/ui/DataGrid';
import { Button } from '@/components/ui/Button';
import type { MachineType } from '@/types';

export default function MachineTypesPage() {
  const router = useRouter();
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [allMachineTypes, setAllMachineTypes] = useState<MachineType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    checkRole();
    fetchMachineTypes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allMachineTypes.filter(mt => 
        mt.machineTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mt.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMachineTypes(filtered);
    } else {
      setMachineTypes(allMachineTypes);
    }
  }, [searchTerm, allMachineTypes]);

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

  async function fetchMachineTypes() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/machine-types');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des types de machines');
      }
      
      const result = await response.json();
      setAllMachineTypes(result.data || []);
      setMachineTypes(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce type de machine ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/machine-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression du type de machine');
      }

      fetchMachineTypes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression du type de machine');
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const response = await fetch(`/api/machine-types/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la duplication du type de machine');
      }

      fetchMachineTypes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la duplication du type de machine');
    }
  }

  async function handleExport(format: 'csv' | 'json' | 'xlsx') {
    try {
      setIsExporting(true);
      const response = await fetch(`/api/machine-types/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'exportation des types de machines');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `machine-types-${date}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'exportation');
    } finally {
      setIsExporting(false);
    }
  }

  const columns = [
    {
      key: 'machineTypeId',
      label: 'ID Type',
      render: (mt: MachineType) => (
        <span className="font-mono text-sm">{mt.machineTypeId}</span>
      ),
    },
    {
      key: 'machineTypeName',
      label: 'Type de machine',
      render: (mt: MachineType) => (
        <div>
          <div className="font-medium">{mt.machineTypeName}</div>
          {mt.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{mt.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'manufacturer',
      label: 'Fabricant',
    },
    {
      key: 'axes',
      label: 'Axes (mm / deg)',
      render: (mt: MachineType) => {
        const hasRotation = mt.a > 0 || mt.b > 0 || mt.c > 0 || mt.a === -1 || mt.b === -1 || mt.c === -1;
        const formatRotation = (val: number) => val === -1 ? '∞' : val;
        return (
          <div className="text-sm">
            <div>X:{mt.x} Y:{mt.y} Z:{mt.z}</div>
            {hasRotation && (
              <div className="text-gray-500">A:{formatRotation(mt.a)} B:{formatRotation(mt.b)} C:{formatRotation(mt.c)}</div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">
            Configurateur de types de machines
          </h2>
          <p className="text-secondary-600 mt-1">
            Gérer les spécifications des types de machines CNC
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Button
              variant="secondary"
              onClick={() => {}}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportation...
                </>
              ) : (
                <>
                  Exporter
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </Button>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={() => handleExport('csv')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Exporter CSV
              </button>
              <button
                onClick={() => handleExport('xlsx')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Exporter Excel
              </button>
              <button
                onClick={() => handleExport('json')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Exporter JSON
              </button>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => router.push('/machine-types/new')}>
              Ajouter un type
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou fabricant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 w-full"
        />
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DataGrid
        columns={columns}
        data={machineTypes}
        keyExtractor={(mt) => mt.id}
        emptyMessage="Aucun type de machine enregistré"
        isLoading={isLoading}
        actions={isAdmin ? (mt) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => router.push(`/machine-types/${mt.id}`)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors group relative"
              title="Voir/Modifier"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => handleDuplicate(mt.id)}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors group relative"
              title="Dupliquer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(mt.id)}
              className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded transition-colors group relative"
              title="Supprimer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ) : undefined}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@/components/ui/DataGrid';
import { Button } from '@/components/ui/Button';
import type { Machine } from '@/types';

export default function MachinesPage() {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allMachines.filter(m => 
        m.numeroOL.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMachines(filtered);
    } else {
      setMachines(allMachines);
    }
  }, [searchTerm, allMachines]);

  async function fetchMachines() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/machines?limit=100');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des machines');
      }
      
      const result = await response.json();
      setAllMachines(result.data || []);
      setMachines(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/machines/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      // Refresh list
      fetchMachines();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  const columns = [
    {
      key: 'numeroOL',
      label: 'Numéro OL',
    },
    {
      key: 'type',
      label: 'Type de machine',
    },
    {
      key: 'clientName',
      label: 'Client',
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      render: (machine: Machine) => {
        return new Date(machine.createdAt).toLocaleDateString('fr-CA');
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">
            Gestion des machines
          </h2>
          <p className="text-secondary-600 mt-1">
            Liste de toutes les machines enregistrées
          </p>
        </div>
        <Button onClick={() => router.push('/machines/new')}>
          Nouvelle machine
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Rechercher par numéro OL, type ou client..."
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
        data={machines}
        keyExtractor={(machine) => machine.id}
        emptyMessage="Aucune machine enregistrée"
        isLoading={isLoading}
        actions={(machine) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => router.push(`/machines/${machine.id}`)}
              className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors group relative"
              title="Modifier"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="absolute right-0 bottom-full mb-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Modifier
              </span>
            </button>
            <button
              onClick={() => handleDelete(machine.id)}
              className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded transition-colors group relative"
              title="Supprimer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="absolute right-0 bottom-full mb-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Supprimer
              </span>
            </button>
          </div>
        )}
      />
    </div>
  );
}

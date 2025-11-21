'use client';

import { useEffect, useState } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import type { Machine } from '@/types';

export default function HomePage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchMachines() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/machines?limit=50');
        
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
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Machines CNC
        </h2>
        <p className="text-secondary-600">
          Liste de toutes les machines enregistrées dans le système
        </p>
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
      />
    </div>
  );
}


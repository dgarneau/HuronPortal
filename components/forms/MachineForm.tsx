'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { machineCreateSchema, type MachineCreateInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Machine, Client } from '@/types';

interface MachineFormProps {
  machine?: Machine;
  mode: 'create' | 'edit';
}

export function MachineForm({ machine, mode }: MachineFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MachineCreateInput>({
    resolver: zodResolver(machineCreateSchema),
    defaultValues: machine ? {
      numeroOL: machine.numeroOL,
      type: machine.type,
      clientId: machine.clientId,
    } : undefined,
  });

  const selectedClientId = watch('clientId');

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (clientSearch.length >= 2) {
      searchClients();
    } else {
      fetchClients();
    }
  }, [clientSearch]);

  async function fetchClients() {
    try {
      const response = await fetch('/api/clients?limit=100');
      if (response.ok) {
        const result = await response.json();
        setClients(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

  async function searchClients() {
    try {
      setIsSearching(true);
      const response = await fetch(`/api/clients?search=${encodeURIComponent(clientSearch)}`);
      if (response.ok) {
        const result = await response.json();
        setClients(result.data || []);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  }

  const onSubmit = async (data: MachineCreateInput) => {
    setIsLoading(true);
    setServerError('');

    try {
      const url = mode === 'create' 
        ? '/api/machines' 
        : `/api/machines/${machine?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Une erreur est survenue');
      }

      router.push('/machines');
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-2xl">
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <Input
        label="Numéro OL"
        {...register('numeroOL')}
        error={errors.numeroOL?.message}
        placeholder="OL-12345"
        disabled={isLoading}
      />

      <Input
        label="Type de machine"
        {...register('type')}
        error={errors.type?.message}
        placeholder="CNC Lathe, CNC Mill, etc."
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Client
        </label>
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="input-field mb-2"
          disabled={isLoading}
        />
        <select
          {...register('clientId')}
          disabled={isLoading}
          className="input-field"
          size={8}
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.companyName} - {client.address}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="mt-1 text-sm text-error-600">{errors.clientId.message}</p>
        )}
        {selectedClient && (
          <div className="mt-2 p-3 bg-secondary-50 rounded border border-secondary-200">
            <p className="text-sm font-medium text-secondary-900">{selectedClient.companyName}</p>
            <p className="text-sm text-secondary-600">{selectedClient.address}</p>
            <p className="text-sm text-secondary-600">{selectedClient.province} {selectedClient.postalCode}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : mode === 'create' ? 'Créer la machine' : 'Enregistrer'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/machines')}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientCreateSchema, type ClientCreateInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Client } from '@/types';

interface ClientFormProps {
  client?: Client;
  mode: 'create' | 'edit';
}

const provinces = [
  { value: 'QC', label: 'Québec' },
  { value: 'ON', label: 'Ontario' },
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'Colombie-Britannique' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'Nouveau-Brunswick' },
  { value: 'NL', label: 'Terre-Neuve-et-Labrador' },
  { value: 'NT', label: 'Territoires du Nord-Ouest' },
  { value: 'NS', label: 'Nouvelle-Écosse' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'PE', label: 'Île-du-Prince-Édouard' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

export function ClientForm({ client, mode }: ClientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientCreateInput>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: client ? {
      companyName: client.companyName,
      address: client.address,
      province: client.province,
      postalCode: client.postalCode,
    } : undefined,
  });

  const onSubmit = async (data: ClientCreateInput) => {
    setIsLoading(true);
    setServerError('');

    try {
      const url = mode === 'create' 
        ? '/api/clients' 
        : `/api/clients/${client?.id}`;
      
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

      router.push('/clients');
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-2xl">
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <Input
        label="Nom de l'entreprise"
        {...register('companyName')}
        error={errors.companyName?.message}
        disabled={isLoading}
      />

      <Input
        label="Adresse"
        {...register('address')}
        error={errors.address?.message}
        disabled={isLoading}
      />

      <div>
        <label htmlFor="province" className="block text-sm font-medium text-secondary-700 mb-1">
          Province
        </label>
        <select
          id="province"
          {...register('province')}
          disabled={isLoading}
          className="input-field"
        >
          <option value="">Sélectionnez une province</option>
          {provinces.map((prov) => (
            <option key={prov.value} value={prov.value}>
              {prov.label}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="mt-1 text-sm text-error-600">{errors.province.message}</p>
        )}
      </div>

      <Input
        label="Code postal"
        {...register('postalCode')}
        error={errors.postalCode?.message}
        placeholder="A1A 1A1"
        disabled={isLoading}
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : mode === 'create' ? 'Créer le client' : 'Enregistrer'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/clients')}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

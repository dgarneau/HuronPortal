'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { machineTypeCreateSchema, type MachineTypeCreateInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { MachineType } from '@/types';

interface MachineTypeFormProps {
  machineType?: MachineType;
  mode: 'create' | 'edit';
  onSubmit?: (data: MachineTypeCreateInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function MachineTypeForm({ machineType, mode, onSubmit: externalOnSubmit, onCancel: externalOnCancel, isLoading: externalIsLoading }: MachineTypeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MachineTypeCreateInput>({
    resolver: zodResolver(machineTypeCreateSchema),
    defaultValues: machineType ? {
      machineTypeId: machineType.machineTypeId,
      machineTypeName: machineType.machineTypeName,
      manufacturer: machineType.manufacturer,
      description: machineType.description || '',
      x: machineType.x,
      y: machineType.y,
      z: machineType.z,
      a: machineType.a,
      b: machineType.b,
      c: machineType.c,
    } : {
      machineTypeId: 0,
      machineTypeName: '',
      manufacturer: '',
      description: '',
      x: 0,
      y: 0,
      z: 0,
      a: 0,
      b: 0,
      c: 0,
    },
  });

  const onSubmit = async (data: MachineTypeCreateInput) => {
    if (externalOnSubmit) {
      await externalOnSubmit(data);
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const url = mode === 'create' 
        ? '/api/machine-types' 
        : `/api/machine-types/${machineType?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred');
      }

      router.push('/machine-types');
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (externalOnCancel) {
      externalOnCancel();
    } else {
      router.back();
    }
  };

  const loading = externalIsLoading !== undefined ? externalIsLoading : isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-4xl">
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      {/* Basic Information Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ID du type"
            type="number"
            {...register('machineTypeId', { valueAsNumber: true })}
            error={errors.machineTypeId?.message}
            disabled={loading}
            helperText="Identifiant numérique (peut être dupliqué)"
          />

          <Input
            label="Nom du type"
            {...register('machineTypeName')}
            error={errors.machineTypeName?.message}
            disabled={loading}
            helperText="Doit être unique (insensible à la casse)"
            required
          />
        </div>

        <Input
          label="Fabricant"
          {...register('manufacturer')}
          error={errors.manufacturer?.message}
          disabled={loading}
          required
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isLoading}
            placeholder="Optional description or notes"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Max 500 characters</p>
        </div>
      </div>

      {/* Linear Axes Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Axe</h3>
        <p className="text-sm text-gray-600 mb-4">-1 = ∞ , 0 = absent</p>
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="X"
              type="number"
              {...register('x', { valueAsNumber: true })}
              error={errors.x?.message}
              disabled={loading}
              required
            />

            <Input
              label="Y"
              type="number"
              {...register('y', { valueAsNumber: true })}
              error={errors.y?.message}
              disabled={loading}
              required
            />

            <Input
              label="Z"
              type="number"
              {...register('z', { valueAsNumber: true })}
              error={errors.z?.message}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="A"
            type="number"
              step="0.001"
              {...register('a', { valueAsNumber: true })}
              error={errors.a?.message}
              disabled={loading}
              required
            />

            <Input
              label="B"
              type="number"
              step="0.001"
              {...register('b', { valueAsNumber: true })}
              error={errors.b?.message}
              disabled={loading}
              required
            />

            <Input
              label="C"
              type="number"
              step="0.001"
              {...register('c', { valueAsNumber: true })}
              error={errors.c?.message}
              disabled={loading}
              required
            />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          isLoading={loading}
        >
          {mode === 'create' ? 'Créer le type' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}

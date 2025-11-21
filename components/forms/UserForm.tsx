'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { userCreateSchema, userUpdateSchema, type UserCreateInput, type UserUpdateInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { User } from '@/types';

interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
}

const roles = [
  { value: 'Admin', label: 'Administrateur' },
  { value: 'Contrôleur', label: 'Contrôleur' },
  { value: 'Utilisateur', label: 'Utilisateur (lecture seule)' },
];

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput | UserUpdateInput>({
    resolver: zodResolver(mode === 'create' ? userCreateSchema : userUpdateSchema),
    defaultValues: user ? {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    } : {
      isActive: true,
    },
  });

  const onSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    setIsLoading(true);
    setServerError('');

    try {
      const url = mode === 'create' 
        ? '/api/users' 
        : `/api/users/${user?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      // In edit mode, only send changed fields
      const payload = mode === 'edit' ? {
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.isActive,
        ...(data.password && { password: data.password }),
      } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Une erreur est survenue');
      }

      router.push('/users');
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
        label="Nom complet"
        {...register('name')}
        error={(errors as any).name?.message}
        disabled={isLoading}
        placeholder="Jean Tremblay"
      />

      <Input
        label="Courriel"
        type="email"
        {...register('email')}
        error={(errors as any).email?.message}
        disabled={isLoading}
        placeholder="jean.tremblay@exemple.com"
      />

      <Input
        label="Nom d'utilisateur"
        {...register('username')}
        error={errors.username?.message}
        disabled={isLoading || mode === 'edit'}
        placeholder="utilisateur.nom"
      />

      <Input
        label={mode === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
        type="password"
        {...register('password')}
        error={(errors as any).password?.message}
        disabled={isLoading}
        placeholder={mode === 'create' ? 'Minimum 8 caractères' : 'Laisser vide pour ne pas changer'}
      />

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-1">
          Rôle
        </label>
        <select
          id="role"
          {...register('role')}
          disabled={isLoading}
          className="input-field"
        >
          <option value="">Sélectionnez un rôle</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-error-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          {...register('isActive')}
          disabled={isLoading}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-secondary-900">
          Compte actif
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : mode === 'create' ? 'Créer l\'utilisateur' : 'Enregistrer'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/users')}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

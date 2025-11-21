'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@/components/ui/DataGrid';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(allUsers);
    }
  }, [searchTerm, allUsers]);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      
      const result = await response.json();
      setAllUsers(result.data || []);
      setUsers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      // Refresh list
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Nom',
    },
    {
      key: 'email',
      label: 'Courriel',
    },
    {
      key: 'username',
      label: 'Nom d\'utilisateur',
    },
    {
      key: 'role',
      label: 'Rôle',
    },
    {
      key: 'isActive',
      label: 'Statut',
      render: (user: User) => (
        <span className={user.isActive ? 'text-success-600' : 'text-error-600'}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Dernière connexion',
      render: (user: User) => {
        return user.lastLogin 
          ? new Date(user.lastLogin).toLocaleString('fr-CA')
          : 'Jamais';
      },
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      render: (user: User) => {
        return new Date(user.createdAt).toLocaleDateString('fr-CA');
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">
            Gestion des utilisateurs
          </h2>
          <p className="text-secondary-600 mt-1">
            Gérer les comptes utilisateurs (Admin uniquement)
          </p>
        </div>
        <Button onClick={() => router.push('/users/new')}>
          Nouvel utilisateur
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
          placeholder="Rechercher par nom, courriel, nom d'utilisateur ou rôle..."
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
        data={users}
        keyExtractor={(user) => user.id}
        emptyMessage="Aucun utilisateur"
        isLoading={isLoading}
        actions={(user) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => router.push(`/users/${user.id}`)}
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
              onClick={() => handleDelete(user.id)}
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

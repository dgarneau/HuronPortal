'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    console.log('Form data:', data);
    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || 'Une erreur est survenue');
        return;
      }

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    } catch (error) {
      setServerError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <div>
        <Input
          {...register('username')}
          type="text"
          label="Nom d'utilisateur ou courriel"
          error={errors.username?.message}
          autoComplete="username"
          placeholder="utilisateur.nom ou courriel@exemple.com"
          autoFocus
        />
      </div>

      <div>
        <Input
          {...register('password')}
          type="password"
          label="Mot de passe"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Se connecter
      </Button>
    </form>
  );
};

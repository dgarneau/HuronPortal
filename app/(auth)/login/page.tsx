import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            Huron Portal
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Système de Gestion des Machines CNC
          </p>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Connexion
          </h2>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

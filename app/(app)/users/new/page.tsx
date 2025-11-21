import { UserForm } from '@/components/forms/UserForm';

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Nouvel utilisateur
        </h2>
        <p className="text-secondary-600 mt-1">
          Créer un nouveau compte utilisateur
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <UserForm mode="create" />
      </div>
    </div>
  );
}

import { ClientForm } from '@/components/forms/ClientForm';

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Nouveau client
        </h2>
        <p className="text-secondary-600 mt-1">
          Créer un nouveau client dans le système
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <ClientForm mode="create" />
      </div>
    </div>
  );
}

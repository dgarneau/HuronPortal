import { MachineForm } from '@/components/forms/MachineForm';

export default function NewMachinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Nouvelle machine
        </h2>
        <p className="text-secondary-600 mt-1">
          Créer une nouvelle machine dans le système
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <MachineForm mode="create" />
      </div>
    </div>
  );
}

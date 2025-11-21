import { notFound } from 'next/navigation';
import { MachineForm } from '@/components/forms/MachineForm';
import { getMachineById } from '@/lib/cosmos/models/machine';

export default async function EditMachinePage({ params }: { params: { id: string } }) {
  const machine = await getMachineById(params.id);

  if (!machine) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Modifier la machine
        </h2>
        <p className="text-secondary-600 mt-1">
          {machine.numeroOL} - {machine.type}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <MachineForm machine={machine} mode="edit" />
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { ClientForm } from '@/components/forms/ClientForm';
import { getClientById } from '@/lib/cosmos/models/client';

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Modifier le client
        </h2>
        <p className="text-secondary-600 mt-1">
          {client.companyName}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <ClientForm client={client} mode="edit" />
      </div>
    </div>
  );
}

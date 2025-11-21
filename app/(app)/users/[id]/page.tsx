import { notFound } from 'next/navigation';
import { UserForm } from '@/components/forms/UserForm';
import { getUserById } from '@/lib/cosmos/models/user';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">
          Modifier l'utilisateur
        </h2>
        <p className="text-secondary-600 mt-1">
          {user.username}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <UserForm user={user} mode="edit" />
      </div>
    </div>
  );
}

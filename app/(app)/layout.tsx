import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const isAdmin = session.role === 'Admin';
  const canWrite = session.role === 'Admin' || session.role === 'Contrôleur';

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary-700 hover:text-primary-800">
                Huron Portal
              </Link>
              <p className="text-sm text-secondary-600">Bienvenue, {session.username} ({session.role})</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="bg-secondary-200 hover:bg-secondary-300 text-secondary-900 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
          
          <nav className="flex space-x-8 border-t border-secondary-200 pt-4 pb-4">
            <Link
              href="/"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Tableau de bord
            </Link>
            <Link
              href="/machines"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Machines
            </Link>
            <Link
              href="/machine-types"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Types de machines
            </Link>
            <Link
              href="/clients"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Clients
            </Link>
            {isAdmin && (
              <Link
                href="/users"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Utilisateurs
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

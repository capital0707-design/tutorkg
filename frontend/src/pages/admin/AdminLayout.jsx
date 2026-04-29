import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  const { user } = useAuth();
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">🛡️ Админ-панель</h2>
        <nav className="space-y-2">
          <Link to="/admin/tutors" className="block px-3 py-2 rounded hover:bg-gray-100">👨‍🏫 Репетиторы</Link>
          <Link to="/admin/subjects" className="block px-3 py-2 rounded hover:bg-gray-100">📚 Предметы</Link>
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100 mt-4">← На сайт</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
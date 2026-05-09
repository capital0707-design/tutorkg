import { useState, useEffect } from 'react';
import { Routes, Route, Link, } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import TutorProfile from './pages/TutorProfile';
import Tutors from './pages/Tutors';
import AdminPanel from './pages/AdminPanel';
import StudentDashboard from './pages/StudentDashboard';
import TutorDetails from './pages/TutorDetails';
import TutorGuide from './pages/TutorGuide';
import Masters from './pages/Masters';
import MasterDetails from './pages/MasterDetails';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    setMenuOpen(false);
    window.location.href = '/';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Шапка */}
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
              🎓 TutorKG
            </Link>

            {/* Десктопное меню */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded transition">
                    <span className="font-medium text-gray-700">{user.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {user.role === 'TUTOR' ? 'Репетитор' : user.role === 'ADMIN' ? 'Админ' : 'Ученик'}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium transition hover:underline">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/masters" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition">🔧 Мастера</Link>
                  <Link to="/tutors" className="text-gray-700 hover:text-blue-600 font-medium transition">Репетиторы</Link>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">Вход</Link>
                  <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium transition">Регистрация</Link>
                </>
              )}
            </nav>

            {/* Мобильный бургер */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded hover:bg-gray-100 transition" aria-label="Меню">
              {menuOpen ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {/* Мобильное меню */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3 text-sm">
                {user ? (
                  <>
                    <Link to="/profile" onClick={closeMenu} className="py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {user.role === 'TUTOR' ? 'Репетитор' : user.role === 'ADMIN' ? 'Админ' : 'Ученик'}
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="text-left text-red-600 hover:text-red-700 font-medium py-2">Выйти</button>
                  </>
                ) : (
                  <>
                    <Link to="/masters" onClick={closeMenu} className="py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition">🔧 Мастера</Link>
                    <Link to="/tutors" onClick={closeMenu} className="py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition">Репетиторы</Link>
                    <Link to="/login" onClick={closeMenu} className="py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition">Вход</Link>
                    <Link to="/register" onClick={closeMenu} className="py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition">Регистрация</Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Основной контент */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/:id" element={<TutorDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tutor-guide" element={<TutorGuide />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/masters/:id" element={<MasterDetails />} />
            <Route path="*" element={
              <div className="text-center py-20 bg-white rounded-xl shadow mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Страница не найдена</h2>
                <Link to="/" className="text-blue-600 hover:underline">Вернуться на главную</Link>
              </div>
            } />
          </Routes>
        </main>

        {/* Футер */}
        <footer className="bg-gray-100 border-t mt-auto py-4">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-600">
            <p>Copyright © {new Date().getFullYear()} TutorKG. Все права защищены.</p>
            <div className="flex gap-4">
              <Link to="/tutor-guide" className="hover:text-blue-600 transition">Как проводить уроки</Link>
              <Link to="/privacy" className="hover:text-blue-600 transition">Политика конфиденциальности</Link>
              <Link to="/terms" className="hover:text-blue-600 transition">Пользовательское соглашение</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition">Админ-панель</Link>
              )}
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;
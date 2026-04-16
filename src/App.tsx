import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import type { SearchFilters } from './lib/types';

import header from './components/header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import TutorProfilePage from './pages/TutorProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Meeting from './pages/Meeting';

type Page = 'home' | 'catalog' | 'tutor' | 'login' | 'register' | 'dashboard' | 'meeting';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [tutorId, setTutorId] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');

    if (sessionParam) {
      setSessionId(sessionParam);
      setCurrentPage('meeting');
    }
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTutor = (id: string) => {
    setTutorId(id);
    setCurrentPage('tutor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
  };

  const noLayout = currentPage === 'login' || currentPage === 'register' || currentPage === 'meeting';

  return (
    <div className="min-h-screen flex flex-col">
      {!noLayout && (
        <Header
          user={user}
          onNavigate={navigate}
          currentPage={currentPage}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={navigate} onSearch={handleSearch} />
        )}
        {currentPage === 'catalog' && (
          <Catalog
            onViewTutor={handleViewTutor}
            initialFilters={searchFilters}
          />
        )}
        {currentPage === 'tutor' && tutorId && (
          <TutorProfilePage
            tutorId={tutorId}
            onBack={() => setCurrentPage('catalog')}
          />
        )}
        {currentPage === 'login' && (
          <Login onNavigate={navigate} onSuccess={handleAuthSuccess} />
        )}
        {currentPage === 'register' && (
          <Register onNavigate={navigate} onSuccess={handleAuthSuccess} />
        )}
        {currentPage === 'dashboard' && user && (
          <Dashboard user={user} />
        )}
        {currentPage === 'dashboard' && !user && (
          <Login onNavigate={navigate} onSuccess={handleAuthSuccess} />
        )}
        {currentPage === 'meeting' && sessionId && (
          <Meeting sessionId={sessionId} onBack={() => setCurrentPage('dashboard')} />
        )}
      </main>

      {!noLayout && <Footer onNavigate={navigate} />}
    </div>
  );
}

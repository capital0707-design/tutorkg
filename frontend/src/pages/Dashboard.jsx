import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ChatWindow from '../components/ChatWindow';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [bRes, rRes] = await Promise.all([
          axios.get(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get(`${API}/requests/my`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        setBookings(bRes.data);
        setRequests(rRes.data);
      } catch {}
    };
    fetch();
  }, []);

  if (!user) return <p className="text-center py-10">Войдите в аккаунт</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Личный кабинет • {user.role === 'STUDENT' ? 'Ученик' : user.role === 'TUTOR' ? 'Репетитор' : 'Админ'}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">📅 Мои уроки</h2>
          {bookings.length === 0 ? <p className="text-gray-500">Нет активных уроков</p> : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="border p-3 rounded-lg bg-white">
                  <p className="font-medium">{b.subject} • {new Date(b.scheduledFor).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Статус: {b.status}</p>
                  {b.format === 'online' && b.jitsiRoomId && (
                    <a href={`https://meet.jit.si/${b.jitsiRoomId}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm mt-1 block">🎥 Войти в урок</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">📩 Заявки</h2>
          {requests.length === 0 ? <p className="text-gray-500">Нет заявок</p> : (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.id} className="border p-3 rounded-lg bg-white">
                  <p className="font-medium">{r.subject} • {r.format}</p>
                  <p className="text-sm text-gray-600">Статус: {r.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">💬 Чат поддержки</h2>
        <ChatWindow roomId="support-general" userId={user.id} />
      </div>
    </div>
  );
}
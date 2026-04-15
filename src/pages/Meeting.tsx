import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import VideoMeeting from '../components/VideoMeeting';
import { AlertCircle, Loader } from 'lucide-react';

interface SessionData {
  id: string;
  room_name: string;
  title: string;
  status: string;
  tutor_id: string;
  student_id: string;
}

interface MeetingProps {
  sessionId: string;
  onBack: () => void;
}

export default function Meeting({ sessionId, onBack }: MeetingProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          setError('Требуется авторизация');
          return;
        }

        setUser(currentUser);

        if (!sessionId) {
          setError('ID сессии не найден');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .maybeSingle();

        if (fetchError) {
          setError('Ошибка загрузки сессии');
          return;
        }

        if (!data) {
          setError('Сессия не найдена');
          return;
        }

        const isParticipant =
          currentUser.id === data.tutor_id || currentUser.id === data.student_id;

        if (!isParticipant) {
          setError('У вас нет доступа к этой встрече');
          return;
        }

        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', sessionId);

        if (updateError) {
          console.error('Error updating session:', updateError);
        }

        setSession(data);
      } catch (err) {
        setError('Произошла ошибка');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-3" />
          <p className="text-white">Загрузка встречи...</p>
        </div>
      </div>
    );
  }

  if (error || !session || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Ошибка</h2>
          <p className="text-gray-300 mb-6">{error || 'Не удалось загрузить встречу'}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Вернуться в панель
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Пользователь';

  return (
    <VideoMeeting
      roomName={session.room_name}
      userName={user.email || 'user'}
      displayName={displayName}
    />
  );
}

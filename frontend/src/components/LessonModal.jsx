import { useEffect, useRef, useState } from 'react';

const LessonModal = ({ isOpen, onClose, bookingId, tutorName, studentName }) => {
  const jitsiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const initJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        setError('Не удалось загрузить Jitsi Meet SDK. Проверьте интернет или обновите страницу.');
        setLoading(false);
        return;
      }

      const roomName = `tutor-kg-lesson-${bookingId}`;
      setLoading(true);
      setError('');

      try {
        apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiRef.current,
          userInfo: { displayName: studentName || 'Ученик' },
          configOverwrite: {
            defaultLanguage: 'ru',
            disableDeepLinking: true,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat', 'tileview'],
            LANG: 'ru',
          },
        });

        apiRef.current.addEventListener('videoConferenceLeft', onClose);
        apiRef.current.addEventListener('readyToClose', onClose);
        setLoading(false);
      } catch (err) {
        console.error('Jitsi init error:', err);
        setError('Ошибка запуска видеосвязи. Попробуйте обновить страницу.');
        setLoading(false);
      }
    };

    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.onload = initJitsi;
      script.onerror = () => setError('Ошибка загрузки видеосвязи');
      document.head.appendChild(script);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [isOpen, bookingId, studentName, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">📹 Онлайн-урок</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl transition">&times;</button>
        </div>
        
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          {loading && !error && (
            <div className="text-white text-center">
              <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
              <p>Подключение к видеосвязи...</p>
            </div>
          )}
          {error && (
            <div className="text-white text-center p-4">
              <p className="text-red-400 mb-2">⚠️ {error}</p>
              <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition">Закрыть</button>
            </div>
          )}
          <div ref={jitsiRef} className="w-full h-full" />
        </div>

        <div className="p-3 text-sm text-gray-600 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>🎓 Репетитор: <b>{tutorName}</b> | 👤 Ученик: <b>{studentName}</b></span>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Комната: <code className="text-blue-600">tutor-kg-lesson-{bookingId}</code></span>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
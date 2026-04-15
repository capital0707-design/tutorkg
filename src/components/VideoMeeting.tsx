import { useEffect, useRef } from 'react';
import { Phone, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface VideoMeetingProps {
  roomName: string;
  userName: string;
  displayName: string;
}

export default function VideoMeeting({ roomName, userName, displayName }: VideoMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const jitsiApiRef = useRef<any>(null);

  const meetingUrl = `https://meet.jitsi/${roomName}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://meet.jitsi/external_api.js';
    script.async = true;

    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        const api = new window.JitsiMeetExternalAPI('meet.jitsi', {
          roomName: roomName,
          parentNode: containerRef.current,
          userInfo: {
            email: userName,
            displayName: displayName,
          },
          width: '100%',
          height: '100%',
          interfaceConfigOverrides: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'foamenuButton',
              'hangup',
              'profile',
              'chat',
              'recording',
              'livestreaming',
              'etherpad',
              'sharedvideo',
              'settings',
              'raisehand',
              'videoquality',
              'filmstrip',
              'invite',
              'feedback',
              'stats',
              'shortcuts',
              'tileview',
              'videobackgroundblur',
              'download',
              'help',
              'mute-everyone',
              'e2ee',
            ],
            SHOW_JITSI_WATERMARK: false,
            MOBILE_APP_PROMO: false,
            LANG_DETECTION: false,
            DEFAULT_LANGUAGE: 'ru',
          },
          configOverrides: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
        });

        jitsiApiRef.current = api;

        api.addEventListener('readyToClose', () => {
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [roomName, userName, displayName]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHangUp = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="flex-1 relative">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">
            Комната: <span className="font-mono font-semibold">{roomName}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Скопировать ссылку
              </>
            )}
          </button>

          <button
            onClick={handleHangUp}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Завершить
          </button>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API.replace('/api', '');

export default function ChatWindow({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join-room', roomId);

    socketRef.current.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current?.disconnect();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current.emit('send-message', { roomId, message: input.trim(), sender: userId });
    setInput('');
  };

  return (
    <div className="border rounded-lg bg-white flex flex-col h-96">
      <div className="p-3 bg-gray-50 border-b font-medium text-gray-700">💬 Чат</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.sender === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            <p className="text-sm">{m.message}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={send} className="p-2 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">➤</button>
      </form>
    </div>
  );
}
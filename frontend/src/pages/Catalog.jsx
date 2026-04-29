import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import TutorCard from '../components/TutorCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Catalog() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = new URLSearchParams(searchParams).toString();
    axios.get(`${API}/tutors${query ? '?' + query : ''}`)
      .then(({ data }) => { setTutors(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [searchParams]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Каталог репетиторов</h1>
      {loading ? (
        <p className="text-center py-10">Загрузка...</p>
      ) : tutors.length === 0 ? (
        <p className="text-center py-10 text-gray-500">Репетиторы не найдены. Попробуйте изменить фильтры.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map(t => <TutorCard key={t.id} tutor={t} />)}
        </div>
      )}
    </div>
  );
}
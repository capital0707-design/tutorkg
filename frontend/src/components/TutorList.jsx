const TutorList = ({ tutors }) => {
  if (!tutors || tutors.length === 0) {
    return <div className="text-center p-8 text-gray-500">Репетиторы не найдены</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tutors.map(tutor => (
        <div key={tutor.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{tutor.user?.name || 'Репетитор'}</h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{tutor.bio}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tutor.subjects?.split(',').map((sub, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{sub}</span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-green-600">{tutor.pricePerHour} сом/час</span>
            <span className="text-sm text-gray-500">
              {tutor.formats?.includes('online') ? '🖥️ Онлайн' : ''}
              {tutor.formats?.includes('offline') ? ' 🏫 Офлайн' : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TutorList;
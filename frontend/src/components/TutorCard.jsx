const TutorCard = ({ tutor }) => {
  // ✅ Превращаем строку "Математика,Физика" в массив ["Математика", "Физика"]
  const subjectsArray = typeof tutor.subjects === 'string' 
    ? tutor.subjects.split(',').map(s => s.trim()).filter(s => s) 
    : Array.isArray(tutor.subjects) 
      ? tutor.subjects 
      : [];

  const formatsArray = typeof tutor.formats === 'string'
    ? tutor.formats.split(',').map(f => f.trim())
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
      {/* Имя и аватар */}
      <div className="flex items-center gap-4 mb-4">
        {tutor.user?.avatar ? (
          <img src={tutor.user.avatar} alt={tutor.user.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {tutor.user?.name?.[0] || 'Р'}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-800">{tutor.user?.name || 'Репетитор'}</h3>
          {tutor.rating && (
            <span className="text-sm text-yellow-500">★ {tutor.rating} ({tutor.reviewCount || 0})</span>
          )}
        </div>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutor.bio}</p>

      {/* Предметы */}
      <div className="flex flex-wrap gap-2 mb-4">
        {subjectsArray.slice(0, 3).map((sub, i) => (
          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {sub}
          </span>
        ))}
        {subjectsArray.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            +{subjectsArray.length - 3}
          </span>
        )}
      </div>

      {/* Формат и цена */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-lg font-bold text-green-600">{tutor.pricePerHour} сом/час</span>
        <div className="text-sm text-gray-500">
          {formatsArray.includes('online') && <span>🖥️</span>}
          {formatsArray.includes('offline') && <span> 🏫</span>}
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
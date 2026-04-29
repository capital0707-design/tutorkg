import { Link } from 'react-router-dom';

const Terms = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Пользовательское соглашение</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>1. Сервис предназначен для поиска репетиторов и учеников в Бишкеке.</p>
        <p>2. Запрещено размещать недостоверную информацию или нарушать права других.</p>
        <p>3. Администрация не несет ответственности за качество услуг, оказанных репетиторами.</p>
        <p>4. При нарушении правил аккаунт может быть заблокирован без предупреждения.</p>
      </div>
      <Link to="/" className="inline-block mt-8 text-blue-600 hover:underline font-medium">← На главную</Link>
    </div>
  </div>
);
export default Terms;
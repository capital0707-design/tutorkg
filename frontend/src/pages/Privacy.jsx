import { Link } from 'react-router-dom';

const Privacy = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Политика конфиденциальности</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>1. Мы собираем только необходимые данные для работы сервиса (имя, телефон, роль).</p>
        <p>2. Ваши данные не передаются третьим лицам без вашего согласия.</p>
        <p>3. Вы можете запросить удаление своих данных, написав на support@tutor.kg.</p>
        <p>4. Оставаясь на сайте, вы соглашаетесь с настоящей политикой.</p>
      </div>
      <Link to="/" className="inline-block mt-8 text-blue-600 hover:underline font-medium">← На главную</Link>
    </div>
  </div>
);
export default Privacy;
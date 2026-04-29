import { Link } from 'react-router-dom';

const TutorGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
          ← На главную
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Инструкция для репетитора</h1>
        <p className="text-gray-600 mb-8">Как проводить онлайн-уроки на платформе TutorKG</p>

        {/* ✅ Перед первым уроком */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg">✅</span>
            Перед первым уроком
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-blue-900 mb-3">1. Проверьте оборудование:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🎤</span>
                <span><b>Микрофон</b> (встроенный или гарнитура)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">📹</span>
                <span><b>Веб-камера</b></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🌐</span>
                <span><b>Стабильный интернет</b> (минимум 2 Мбит/с)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">💻</span>
                <span><b>Браузер</b>: Chrome, Firefox или Edge (последняя версия)</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-semibold text-yellow-900 mb-3">2. Разрешите доступ к камере и микрофону:</h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• При первом входе браузер спросит разрешение → нажмите <b>«Разрешить»</b></li>
              <li>• Если случайно нажали «Заблокировать»: кликните на 🔒 в адресной строке → «Настройки сайта» → разрешите камеру/микрофон</li>
            </ul>
          </div>
        </section>

        {/* 📅 Как провести урок */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <span className="bg-green-100 p-2 rounded-lg">📅</span>
            Как провести урок
          </h2>

          <div className="space-y-4">
            <div className="bg-white border-2 border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-800 mb-2">Шаг 1. Подтвердите заявку</h3>
              <p className="text-gray-700">
                Зайдите в <b>Админ-панель</b> (ссылка в футере сайта) → найдите новую заявку → 
                измените статус на <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✅ Подтверждено</span>
              </p>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-800 mb-2">Шаг 2. Подключитесь к уроку</h3>
              <p className="text-gray-700 mb-2">
                В админ-панели рядом с подтверждённой заявкой нажмите кнопку 
                <span className="inline-block mx-1 px-2 py-0.5 bg-green-600 text-white rounded text-sm font-semibold">📹 Провести урок</span>
              </p>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Откроется окно видеосвязи</li>
                <li>Подождите, пока ученик подключится (или подключитесь первым)</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-800 mb-2">Шаг 3. Проведите занятие</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">🎤</span>
                  <span>Говорите в микрофон</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">📹</span>
                  <span>Включите камеру для личного контакта</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">🖥️</span>
                  <span>Нажмите <b>«Демонстрация экрана»</b> (кнопка в панели инструментов), чтобы показать материал</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">💬</span>
                  <span>Используйте чат (кнопка «Chat») для отправки ссылок или заметок</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-800 mb-2">Шаг 4. Завершите урок</h3>
              <p className="text-gray-700">
                Нажмите красную кнопку <b>📞 Завершить звонок</b> → ученик автоматически отключится
              </p>
            </div>
          </div>
        </section>

        {/* 💡 Полезные советы */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span className="bg-purple-100 p-2 rounded-lg">💡</span>
            Полезные советы
          </h2>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <ul className="space-y-3 text-purple-900">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">🔔</span>
                <span><b>За 5-10 минут до урока</b> зайдите в админ-панель, чтобы быть готовым</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">🎧</span>
                <span><b>Используйте наушники</b> — это уменьшает эхо и улучшает качество звука</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">📝</span>
                <span><b>Проверьте ссылку на комнату</b> — она уникальна для каждой заявки (номер бронирования)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">🔄</span>
                <span><b>Если связь прервалась</b> — просто снова нажмите «📹 Провести урок», вы вернётесь в ту же комнату</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ❓ Если что-то не работает */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span className="bg-red-100 p-2 rounded-lg">❓</span>
            Если что-то не работает
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50 border-b-2 border-red-200">
                  <th className="px-4 py-3 text-red-900 font-semibold">Проблема</th>
                  <th className="px-4 py-3 text-red-900 font-semibold">Решение</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">Не видно/не слышно ученика</td>
                  <td className="px-4 py-3">Проверьте, включены ли камера/микрофон (иконки в нижней панели)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">Чёрный экран вместо видео</td>
                  <td className="px-4 py-3">Разрешите доступ к камере в браузере</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">Плохое качество связи</td>
                  <td className="px-4 py-3">Закройте лишние вкладки, проверьте интернет</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Не получается войти</td>
                  <td className="px-4 py-3">Обновите страницу (Ctrl + F5) и попробуйте снова</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 📞 Контакты поддержки */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">📞 Нужна помощь?</h2>
          <p className="mb-4">Если у вас возникли вопросы, напишите нам</p>
          <Link to="/" className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            Связаться с поддержкой
          </Link>
        </section>
      </div>
    </div>
  );
};

export default TutorGuide;
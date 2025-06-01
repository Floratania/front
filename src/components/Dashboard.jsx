import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [greeting, setGreeting] = useState('');

  const greetings = [
    'Гарного дня для навчання! ☀️',
    'Час підтягнути англійську 💪',
    'Розум — це м’яз. Тренуй його! 🧠',
    'Сьогодні — ідеальний день для нових слів 📚',
    'З кожним словом ти ближче до мети 🌍'
  ];

  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, []);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        link: 'bg-[#2b2b3c] text-white hover:bg-[#3a3a4d]',
        text: 'text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        link: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        text: 'text-gray-900',
      };

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10 transition-all duration-500`}>
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button> */}

      <div className={`max-w-5xl mx-auto rounded-3xl shadow-xl ${themeClasses.card} p-10`}>
        <h1 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>
          👋 Вітаємо, {user?.username || 'користувачу'}!
        </h1>
        <p className={`mb-6 text-md ${themeClasses.text}`}>{greeting}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/flashcards" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            📚 Флеш-картки
          </Link>
          <Link to="/translate" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            🌍 Перекладач
          </Link>
          <Link to="/level-test" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            🧪 Тест рівня
          </Link>
          <Link to="/tenses" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            ⏳ Вивчити часи
          </Link>
          <Link to="/wd" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            🧩 Складання речень
          </Link>
          <Link to="/wordsets" className={`rounded-xl p-5 text-center font-semibold shadow hover:scale-[1.02] transition ${themeClasses.link}`}>
            📖 Обрати словник
          </Link>
        </div>
      </div>
    </div>
  );
}

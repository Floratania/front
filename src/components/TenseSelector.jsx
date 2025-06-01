import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const TENSES = [
  { name: 'Present Simple', ua: 'Теперішній простий (Present Simple)' },
  { name: 'Present Continuous', ua: 'Теперішній тривалий (Present Continuous)' },
  { name: 'Present Perfect', ua: 'Теперішній доконаний (Present Perfect)' },
  { name: 'Present Perfect Continuous', ua: 'Теперішній доконано-тривалий (Present Perfect Continuous)' },
  { name: 'Past Simple', ua: 'Минулий простий (Past Simple)' },
  { name: 'Past Continuous', ua: 'Минулий тривалий (Past Continuous)' },
  { name: 'Past Perfect', ua: 'Минулий доконаний (Past Perfect)' },
  { name: 'Past Perfect Continuous', ua: 'Минулий доконано-тривалий (Past Perfect Continuous)' },
  { name: 'Future Simple', ua: 'Майбутній простий (Future Simple)' },
  { name: 'Future Continuous', ua: 'Майбутній тривалий (Future Continuous)' },
  { name: 'Future Perfect', ua: 'Майбутній доконаний (Future Perfect)' },
  { name: 'Future Perfect Continuous', ua: 'Майбутній доконано-тривалий (Future Perfect Continuous)' },
];

export default function TenseSelector() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#2b2b3c] text-white hover:scale-105 hover:shadow-xl',
        button: 'bg-white text-gray-700',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white text-gray-800 hover:scale-105 hover:shadow-xl',
        button: 'bg-white text-gray-700',
      };

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10`}>
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button> */}

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🕒 Оберіть граматичний час</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {TENSES.map((tense) => (
            <Link
              key={tense.name}
              to={`/tense/${encodeURIComponent(tense.name)}`}
              className={`block p-5 rounded-xl font-semibold transition duration-200 shadow-md ${themeClasses.card}`}
            >
              {tense.ua}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

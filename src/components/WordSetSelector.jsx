import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getWordSets, subscribeToSet } from '../services/wordsets';
import { ThemeContext } from '../context/ThemeContext';

const WordSetSelector = ({ onSubscribed, currentUserId }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sets, setSets] = useState([]);
  const [error, setError] = useState('');

  // Темні та світлі теми для фону, карток, кнопок та тексту
  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        text: 'text-white',
        subtext: 'text-gray-400',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white hover:scale-105',
        border: 'border-gray-700',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105',
        border: 'border-gray-300',
      };

  useEffect(() => {
    getWordSets()
      .then((res) => {
        const allSets = Array.isArray(res) ? res : res?.data || [];
        const publicNotMine = allSets.filter(
          (set) => set.is_public && set.owner !== currentUserId
        );
        setSets(publicNotMine);
      })
      .catch(() => {
        setError('📡 Помилка завантаження наборів слів.');
      });
  }, [currentUserId]);

  const handleSubscribe = async (id) => {
    await subscribeToSet(id);
    onSubscribed();
  };

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10 transition-all duration-500`}>
    {/* Theme Toggle Button */}
    {/* <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
    >
      {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
    </button> */}
    
    <div className={`min-h-screen ${themeClasses.page} p-6 flex flex-col items-center relative`}>
    {/* Theme Toggle (always at top) */}


    {/* <div className={`min-h-screen ${themeClasses.page} px-6 py-10 relative`}> */}
      {/* Toggle Theme Button */}
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button> */}

      <div className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-lg ${themeClasses.card}`}>
        <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>📚 Доступні набори слів</h2>

        {error && <p className="text-red-500 font-medium mb-8">{error}</p>}

        {!sets.length && !error ? (
          <div className={`text-md ${themeClasses.subtext}`}>
            <p className="mb-2">❌ Наразі немає доступних публічних наборів слів.</p>
            <p>
              👉 Ви можете <Link to="/import" className="underline font-medium">завантажити власний .txt файл</Link>, де кожне слово — в новому рядку.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {sets.map((set) => (
              <li
                key={set.id}
                className={`flex justify-between items-center p-4 rounded-xl border  ${themeClasses.border} ${themeClasses.card}`}
              >
                <span className={`font-medium ${themeClasses.text}`}>{set.name}</span>
                {'\u00A0'} {/* Non-breaking space for better alignment */}
                {'\u00A0'} {/* Non-breaking space for better alignment */}
                {'\u00A0'} {/* Non-breaking space for better alignment */}
                
                <button
                  onClick={() => handleSubscribe(set.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ${themeClasses.button}`}
                >
                  ➕ Додати
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default WordSetSelector;

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getWordSets, subscribeToSet, unsubscribeFromSet } from '../services/wordsets';
import { ThemeContext } from '../context/ThemeContext';

const WordSetSelector = ({ currentUserId }) => {
  const { theme } = useContext(ThemeContext);
  const [sets, setSets] = useState([]);
  const [error, setError] = useState('');

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
        const publicNotMine = allSets
          .filter((set) => set.is_public && set.owner !== currentUserId)
          .map((set) => ({
            ...set,
            is_subscribed: set.user_has_subscribed || false
          }));
        setSets(publicNotMine);
      })
      .catch(() => {
        setError('📡 Помилка завантаження наборів слів.');
      });
  }, [currentUserId]);

  const handleToggleSubscribe = async (id, isSubscribed) => {
    try {
      if (isSubscribed) {
        await unsubscribeFromSet(id);
      } else {
        await subscribeToSet(id);
      }

      // 🔁 Локально оновити статус
      setSets((prevSets) =>
        prevSets.map((set) =>
          set.id === id ? { ...set, is_subscribed: !isSubscribed } : set
        )
      );
    } catch {
      setError('⚠️ Помилка підписки/відписки');
    }
  };

  const subscribedSets = sets.filter((set) => set.is_subscribed);
  const unsubscribedSets = sets.filter((set) => !set.is_subscribed);

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10 transition-all duration-500`}>
      <div className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-lg ${themeClasses.card}`}>
        <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>📚 Доступні набори слів</h2>

        {error && <p className="text-red-500 font-medium mb-6">{error}</p>}

        {!sets.length && !error ? (
          <div className={`text-md ${themeClasses.subtext}`}>
            <p className="mb-2">❌ Наразі немає доступних публічних наборів слів.</p>
            <p>
              👉 Ви можете <Link to="/import" className="underline font-medium">завантажити власний .txt файл</Link>, де кожне слово — в новому рядку.
            </p>
          </div>
        ) : (
          <>
            {/* 🔴 Підписані */}
            {subscribedSets.length > 0 && (
              <div className={`mb-8 p-4 rounded-xl shadow-inner ${theme === 'dark' ? 'bg-[#2c2c40]' : 'bg-purple-100'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>✅ Ви вже підписані:</h3>
                <ul className="space-y-3">
                  {subscribedSets.map((set) => (
                    <li
                      key={set.id}
                      className={`flex justify-between items-center p-4 rounded-xl border ${themeClasses.border} ${themeClasses.card}`}
                    >
                      <span className={`font-medium ${themeClasses.text}`}>{set.name}</span>
                      <button
                        onClick={() => handleToggleSubscribe(set.id, true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ${themeClasses.button}`}
                      >
                        ❌ Видалити
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🟢 Доступні до додавання */}
            {unsubscribedSets.length > 0 && (
              <div className={`p-4 rounded-xl shadow-inner ${theme === 'dark' ? 'bg-[#e5623055]' : 'bg-blue-100'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>🆕 Доступні для додавання:</h3>
                <ul className="space-y-3">
                  {unsubscribedSets.map((set) => (
                    <li
                      key={set.id}
                      className={`flex justify-between items-center p-4 rounded-xl border ${themeClasses.border} ${themeClasses.card}`}
                    >
                      <span className={`font-medium ${themeClasses.text}`}>{set.name}</span>
                      <button
                        onClick={() => handleToggleSubscribe(set.id, false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ${themeClasses.button}`}
                      >
                        ➕ Додати
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordSetSelector;

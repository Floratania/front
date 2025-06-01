import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getFlashcards, updateProgress } from '../services/flashcards';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import './FlashcardTrainer.css';

const FlashcardTrainer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState('');
  const [skippedCards, setSkippedCards] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(['new', 'learning']);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const statusOptions = [
    { value: 'new', label: '🆕 Нові' },
    { value: 'learning', label: '🧠 Вчу' },
    { value: 'learned', label: '✅ Вивчені' },
  ];

  useEffect(() => {
    api.get('flashcards/user-preferences/')
      .then(res => {
        if (Array.isArray(res.data.selected_statuses)) {
          setSelectedStatuses(res.data.selected_statuses);
        }
      })
      .catch(() => {
        setSelectedStatuses(['new', 'learning']);
      });
  }, []);

  const savePreferences = (statuses) => {
    api.post('flashcards/user-preferences/', { selected_statuses: statuses }).catch(() => {});
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedStatuses(prev => {
      const updated = checked ? [...prev, value] : prev.filter(s => s !== value);
      savePreferences(updated);
      return updated;
    });
  };

  const loadFlashcards = () => {
    getFlashcards(selectedStatuses)
      .then(data => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setSkippedCards(new Set());
        setCurrentIndex(0);
        setFlipped(false);
        setError('');
        setIsTrainingStarted(true);
        setLearnedCount(0);
      })
      .catch(() => {
        setError('❌ Не вдалося завантажити картки.');
      });
  };

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    const card = flashcards[currentIndex];
    if (!card) return;
    setSkippedCards(prev => new Set(prev).add(card.id));
    const remaining = flashcards.filter((_, i) => i !== currentIndex && !skippedCards.has(_.id));
    setFlashcards(remaining);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handleProgress = (status) => {
    const card = flashcards[currentIndex];
    if (!card) return;
    updateProgress(card.id, status)
      .then(() => {
        const remaining = flashcards.filter((_, i) => i !== currentIndex);
        setFlashcards(remaining);
        setCurrentIndex(0);
        setFlipped(false);
        if (status === 'learned') setLearnedCount(prev => prev + 1);
      })
      .catch(() => {
        setError('❌ Помилка оновлення статусу картки.');
      });
  };

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b] text-white',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] hover:bg-[#5b1c48] text-white',
        flipText: 'text-black',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white text-gray-900',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        flipText: 'text-gray-900',
      };

  const card = flashcards[currentIndex];

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10 transition-all duration-500`}>
      {/* Theme Toggle Button */}
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button>
       */}
      <div className={`min-h-screen ${themeClasses.page} p-6 flex flex-col items-center relative`}>
      {/* Theme Toggle (always at top) */}

      {error && (
        <div className="text-red-500 font-bold">
          <p>{error}</p>
          <Link to="/wordsets" className="underline">Обрати набір слів</Link>
        </div>
      )}

      {!isTrainingStarted ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Оберіть типи слів для тренування:</h2>
          <form className="space-y-2 mb-6">
            {statusOptions.map(opt => (
              <label key={opt.value} className="block text-lg">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedStatuses.includes(opt.value)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </form>
          <button
            onClick={loadFlashcards}
            disabled={selectedStatuses.length === 0}
            className={`px-6 py-3 rounded-xl font-medium hover:shadow-xl ${themeClasses.button}`}
          >
            🚀 Почати тренування
          </button>
        </>
      ) : flashcards.length === 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4">🎉 Вітаємо!</h2>
          <p className="mb-4 text-lg">Усі слова з обраними статусами опрацьовані.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/wordsets"
              className={`px-5 py-3 rounded-xl font-semibold text-center hover:shadow-xl ${themeClasses.button}`}
            >
              📖 Обрати інший набір
            </Link>
            <button
              onClick={() => {
                setIsTrainingStarted(false);
                setFlashcards([]);
              }}
              className={`px-5 py-3 rounded-xl font-semibold hover:shadow-xl ${themeClasses.button}`}
            >
              🔄 Змінити статуси
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2 text-sm">🔁 Карток залишилось: {flashcards.length}</p>
          <p className="mb-4 text-sm">✅ Вивчено: {learnedCount}</p>

          <div className="h-52 perspective mb-6 cursor-pointer" onClick={handleFlip}>
            <div className={`trainer-card ${flipped ? 'flipped' : ''} ${themeClasses.card}`}>
              <div className={`front flex items-center justify-center p-6 font-bold text-xl ${themeClasses.flipText}`}>
                {card.word}
              </div>
              <div className={`back flex items-center justify-center p-6 font-bold text-xl ${themeClasses.flipText}`}>
                {card.definition || 'немає перекладу'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <button onClick={() => handleProgress('learning')} className={`px-5 py-2 rounded-xl hover:shadow-xl ${themeClasses.button}`}>
              🧠 Вчу
            </button>
            <button onClick={() => handleProgress('learned')} className={`px-5 py-2 rounded-xl hover:shadow-xl ${themeClasses.button}`}>
              ✅ Вивчив
            </button>
            <button onClick={handleNext} className={`px-5 py-2 rounded-xl hover:shadow-xl ${themeClasses.button}`}>
              ➡️ Пропустити
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default FlashcardTrainer;

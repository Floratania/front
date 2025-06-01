import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const Translate = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Додаємо контекст теми
  const [input, setInput] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('en_to_uk');
  const [history, setHistory] = useState([]);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        text: 'text-white',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white hover:scale-105',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        select: 'bg-[#2b2b3c] text-white border-[#444]',
        result: 'bg-[#2b2b3c] text-white p-4 rounded-lg',
        history: 'text-white',
        error: 'text-red-500',
        copyButton: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white px-3 py-2 mt-2 rounded-lg hover:scale-105',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white shadow-lg border-2 border-blue-500', // Додаємо рамку для світлої теми
        text: 'text-gray-900',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105',
        input: 'bg-gray-100 text-gray-800 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500', // Яскрава рамка для полів вводу
        select: 'bg-gray-100 text-gray-800 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500',
        result: 'bg-gray-100 text-gray-900 p-4 rounded-lg',
        history: 'text-gray-900',
        error: 'text-red-500',
        copyButton: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 mt-2 rounded-lg hover:scale-105',
      };

  const detectMode = (text) => {
    return text.trim().split(/\s+/).length === 1 ? 'word' : 'sentence';
  };

  const detectDirection = (text) => {
    const cyrillic = /[а-яіїєґА-ЯІЇЄҐ]/g;
    const latin = /[a-zA-Z]/g;

    const cyrCount = (text.match(cyrillic) || []).length;
    const latCount = (text.match(latin) || []).length;

    return latCount >= cyrCount ? 'en_to_uk' : 'uk_to_en';
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;

    const autoDirection = detectDirection(input);
    setDirection(autoDirection);
    setLoading(true);
    setError('');
    setTranslated('');

    try {
      const mode = detectMode(input);
      const res = await axios.post('http://localhost:8000/api/translator/translate/', {
        text: input.trim(),
        mode: mode,
        direction: autoDirection
      });

      setTranslated(res.data.translated);
      setHistory(prev => [...prev, { input, translated: res.data.translated, direction: autoDirection }]);
    } catch (err) {
      console.error(err);
      setError('❌ Помилка при перекладі.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleManualDirectionChange = (e) => {
    const newDir = e.target.value;
    setDirection(newDir);
    setInput('');
    setTranslated('');
    setError('');
  };

  const getPlaceholder = () => {
    return direction === 'en_to_uk'
      ? 'Enter a word or sentence in English...'
      : 'Введіть слово або речення українською...';
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

      <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>🌐 Перекладач</h2>
      <select value={direction} onChange={handleManualDirectionChange} className={`${themeClasses.select} mb-4`}>
        <option value="en_to_uk">🇬🇧 Англійська → 🇺🇦 Українська</option>
        <option value="uk_to_en">🇺🇦 Українська → 🇬🇧 Англійська</option>
      </select>

      <br></br>
      <textarea
        rows={4}
        className={`${themeClasses.input} w-1/2 mb-4`}
        placeholder={getPlaceholder()}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        />
        <br></br>
      <button onClick={handleTranslate} className={`${themeClasses.button} w-50 py-3 font-semibold rounded-xl`}>
        {loading ? 'Переклад...' : 'Перекласти'}
      </button>

      {translated && (
        <div className={`${themeClasses.result} mt-4`}>
          <strong>Переклад:</strong>
          <p>{translated}</p>
          <button onClick={copyToClipboard} className={themeClasses.copyButton}>📋 Копіювати</button>
        </div>
      )}

      {error && <p className={themeClasses.error}>{error}</p>}

      {history.length > 0 && (
        <div className={`${themeClasses.history} mt-6`}>
          <h3>🕓 Історія перекладів:</h3>
          <ul>
            {history.slice().reverse().map((item, index) => (
              <li key={index}><strong>{item.input}</strong> → {item.translated}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Translate;

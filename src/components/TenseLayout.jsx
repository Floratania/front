import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const TenseLayout = ({ tenseName, explanation, structure, examples, practiceTense }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const normalize = (text) =>
    text?.toLowerCase()?.trim().replace(/\s+/g, '');

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/tense/predict/',
        { sentence: input },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const rawTense = res?.data?.tense;
      const predicted = normalize(rawTense);
      const expected = normalize(practiceTense);

      if (predicted === expected) {
        setFeedback('✅ Правильно!');
      } else {
        setFeedback(`❌ Не вірно. Ти використав: ${rawTense}, а потрібно було: ${practiceTense}.`);
      }
    } catch (err) {
      console.error('❌ API error:', err);
      setFeedback('❌ Помилка при перевірці.');
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        input: 'bg-[#2b2b3c] text-white border border-[#444]',
        text: 'text-white',
        subtext: 'text-gray-400',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] hover:brightness-110 text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-white border border-gray-300 text-gray-900',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 text-white',
      };

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10`}>
      <div className="absolute top-4 right-4">
        {/* <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
        >
          {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
        </button> */}
      </div>

      <div className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-xl ${themeClasses.card}`}>
        <h1 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>{tenseName}</h1>
        <p className={`mb-2 ${themeClasses.subtext}`}><strong>Пояснення:</strong> {explanation}</p>
        <p className={`mb-4 ${themeClasses.subtext}`}><strong>Структура:</strong> {structure}</p>

        <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>📌 Приклади:</h3>
        <ul className={`mb-6 space-y-1 ${themeClasses.subtext}`}>
          {examples.map((ex, i) => (
            <li key={i}><strong>{ex.sentence}</strong> – {ex.translation}</li>
          ))}
        </ul>

        <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>📝 Практика</h3>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`w-full mb-4 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${themeClasses.input}`}
          placeholder="Напишіть приклад у цьому часі..."
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold transition ${themeClasses.button}`}
        >
          {loading ? 'Перевірка...' : '✅ Перевірити'}
        </button>

        {feedback && (
          <p className="mt-4 text-sm font-medium">{feedback}</p>
        )}
      </div>
    </div>
  );
};

export default TenseLayout;

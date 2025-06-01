import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const options = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'pronoun',
  'conjunction',
  'interjection',
  'adposition',
];

const partMap = {
  adj: 'adjective',
  adv: 'adverb',
  adp: 'adposition',
  noun: 'noun',
  verb: 'verb',
  prep: 'preposition',
  pron: 'pronoun',
  conj: 'conjunction',
  intj: 'interjection',
  preposition: 'preposition',
  adjective: 'adjective',
  adverb: 'adverb',
  conjunction: 'conjunction',
  pronoun: 'pronoun',
  interjection: 'interjection'
};

const PartOfSpeech = () => {
  const { token } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [mode, setMode] = useState('word');
  const [item, setItem] = useState(null);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        bg: 'bg-[#1c1c2b] text-white',
        btn: 'bg-purple-700 hover:bg-purple-800',
        correct: 'bg-green-600',
        wrong: 'bg-red-500',
        select: 'bg-blue-500 hover:bg-blue-600',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        bg: 'bg-white text-gray-800',
        btn: 'bg-purple-500 hover:bg-purple-600 text-white',
        correct: 'bg-green-500 text-white',
        wrong: 'bg-red-500 text-white',
        select: 'bg-blue-500 hover:bg-blue-600 text-white',
      };

  const loadItem = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/partofspeech/practice/nlp/?type=${mode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItem(res.data);
      setSelected('');
      setResult('');
      setShowTranslation(false);
      setAudioUrl(null);
    } catch (err) {
      console.error("❌ Помилка завантаження:", err);
    }
  };

  const playAudio = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/partofspeech/practice/tts/', {
        params: { text: item.text },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      setAudioUrl(url);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error('❌ Помилка озвучення:', err);
    }
  };

  useEffect(() => {
    loadItem();
  }, [mode]);

  const checkAnswer = (choice) => {
    const correct = partMap[item.correct_part] || item.correct_part;
    setSelected(choice);
    if (choice === correct) {
      setResult('✅ Правильно!');
    } else {
      setResult(`❌ Ні. Правильна відповідь: ${correct}`);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${themeClasses.page}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🧠 Практика частин мови</h1>
         
        </div>

        <div className="flex gap-4">
          <button onClick={() => setMode('word')} className={`px-4 py-2 rounded ${mode === 'word' ? themeClasses.select : 'bg-gray-300'}`}>
            Слово
          </button>
          <button onClick={() => setMode('sentence')} className={`px-4 py-2 rounded text-black ${mode === 'sentence' ? themeClasses.select : 'bg-gray-300'}`}>
            Речення
          </button>
        </div>

        {item && (
          <div className="p-6 border rounded-xl shadow space-y-4">
            <div className="text-center">
              {mode === 'word' ? (
                <h2 className="text-2xl font-semibold">{item.text}</h2>
              ) : (
                <p className="text-lg">
                  {item.full.split(' ').map((w, i) => (
                    <span key={i} className={w === item.text ? 'underline font-bold' : ''}>{w} </span>
                  ))}
                </p>
              )}

              <div className="mt-2 flex justify-center gap-2">
                <button onClick={playAudio} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">🔊 Озвучити</button>
                <button onClick={() => setShowTranslation(true)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">📘 Переклад</button>
              </div>
              {showTranslation && <p className="mt-2 italic">Переклад: {item.translation}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => checkAnswer(opt)}
                  disabled={!!selected}
                  className={`px-4 py-2 rounded font-semibold ${
                    selected
                      ? opt === partMap[item.correct_part]
                        ? themeClasses.correct
                        : 'bg-gray-300'
                      : themeClasses.btn
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {result && <p className="text-lg font-semibold text-center">{result}</p>}

            {selected && (
              <button onClick={loadItem} className="mt-4 mx-auto block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Наступне →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartOfSpeech;

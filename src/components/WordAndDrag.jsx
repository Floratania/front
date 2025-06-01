import React, { useState, useEffect, useRef, useContext } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import './WordAndDrag.css';

const WordDragAndDrop = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [words, setWords] = useState([]);
  const [originalSentence, setOriginalSentence] = useState('');
  const [status, setStatus] = useState('');
  const [animateKey, setAnimateKey] = useState(0);

  const loadSentence = () => {
    API.get('drag-sentence/wd/')
      .then(res => {
        const { shuffled, original } = res.data;
        setWords(shuffled);
        setOriginalSentence(original);
        setStatus('');
        setAnimateKey(prev => prev + 1);
      })
      .catch(err => {
        console.error('❌ Error loading sentence:', err);
        setStatus('❌ Не вдалося завантажити речення.');
      });
  };

  useEffect(() => {
    loadSentence();
  }, []);

  const moveWord = (from, to) => {
    const updated = [...words];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setWords(updated);
  };

  const handleSubmit = () => {
    const sentence = words.join(' ');
    API.post('drag-sentence/check/', {
      sentence,
      original_sentence: originalSentence
    })
      .then(res => {
        setStatus(res.data.is_correct
          ? '✅ Речення правильне!'
          : `❌ Неправильно. Оригінал: "${res.data.original_sentence}"`);
      })
      .catch(err => {
        console.error('❌ Error checking sentence:', err);
        setStatus('❌ Помилка при перевірці.');
      });
  };

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b] p-6 rounded-2xl shadow-lg',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white hover:scale-105 px-6 py-3 rounded-xl font-medium',
        border: 'border-gray-700',
        text: 'text-white',
        subtext: 'text-gray-400',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white p-6 rounded-2xl shadow-lg',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 px-6 py-3 rounded-xl font-medium',
        border: 'border-gray-300',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
      };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen ${themeClasses.page} px-6 py-10`}>
        {/* Button to toggle themes */}
        {/* <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
        >
          {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
        </button> */}

        <div className={themeClasses.card}>
          <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>🧩 Складіть речення</h2>

          {status && <p className={`font-medium mb-4 ${themeClasses.text}`}>{status}</p>}

          <ul className="drag-container space-y-4">
            {words.map((word, idx) => (
              <WordItem key={idx} word={word} index={idx} moveWord={moveWord} theme={theme} />
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <button onClick={handleSubmit} className={themeClasses.button}>✅ Перевірити</button>
            <button onClick={loadSentence} className={`${themeClasses.button} ml-4`}>🔄 Нове речення</button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const WordItem = ({ word, index, moveWord, theme }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'WORD',
    hover(item) {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index;
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'WORD',
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  const themeClasses = theme === 'dark'
    ? {
        item: 'bg-gray text-gray-900 border border-gray-300 p-4 rounded-xl',
      }
    : {
        item: 'bg-white text-gray-900 border border-gray-300 p-4 rounded-xl',
      };

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`drag-item ${themeClasses.item} cursor-move`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease'
      }}
    >
      {word}
    </li>
  );
};

export default WordDragAndDrop;

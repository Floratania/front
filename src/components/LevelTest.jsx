import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LevelTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiBlocks, setAiBlocks] = useState([]);
  const [aiAnswers, setAiAnswers] = useState({});
  const [aiIdx, setAiIdx] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('B1');
  const [blockStep, setBlockStep] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const getNextLevel = (level) => order[Math.min(order.indexOf(level) + 1, order.length - 1)];
  const getPrevLevel = (level) => order[Math.max(order.indexOf(level) - 1, 0)];

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        text: 'text-white',
        button: 'bg-purple-700 text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        button: 'bg-blue-500 text-white',
      };

  useEffect(() => {
    API.get('leveltest/leveltest/')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('❌ Не вдалося завантажити тест');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentIdx >= questions.length && aiBlocks.length === 0) {
      fetchAiBlock(currentLevel);
    }
  }, [currentIdx]);

  const fetchAiBlock = async (level) => {
    try {
      setAiLoading(true);
      const res = await API.get(`leveltest/ai_generate/?level=${level}`);
      const block = res.data.questions.slice(0, 7).map(q => ({
        ...q,
        question_id: q.question,
        level,
      }));

      setAiBlocks(prev => [...prev, block]);
      setBlockStep(prev => prev + 1);
      setCurrentLevel(level);
    } catch {
      alert('❌ Не вдалося завантажити AI-питання');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelect = (qid, selected, fromAi = false) => {
    if (fromAi) {
      setAiAnswers(prev => ({ ...prev, [qid]: selected }));
    } else {
      setAnswers(prev => ({ ...prev, [qid]: selected }));
    }
  };

  const next = () => {
    setCurrentIdx(prev => prev + 1);
  };

  const nextAi = () => {
    const currentBlock = aiBlocks[aiBlocks.length - 1];
    const currentQuestion = currentBlock[aiIdx];
    if (!currentQuestion) return;

    const answeredCount = currentBlock.filter(q => aiAnswers[q.question_id]).length;

    if (
      answeredCount === 4 &&
      blockStep < 5 &&
      aiIdx === 3
    ) {
      const score = evaluateAiBlock(currentBlock);
      let nextLevel = currentLevel;
      if (score >= 70) {
        nextLevel = getNextLevel(currentLevel);
      } else if (score < 40) {
        nextLevel = getPrevLevel(currentLevel);
      }

      if (blockStep < 5 && (!aiBlocks[blockStep])) {
        fetchAiBlock(nextLevel);
      }
    }

    if (aiIdx + 1 < currentBlock.length) {
      setAiIdx(aiIdx + 1);
    } else {
      handleAiSubmit(currentBlock);
    }
  };

  const evaluateAiBlock = (block) => {
    let correct = 0;
    block.forEach(q => {
      if (aiAnswers[q.question_id] === q.correct) correct++;
    });
    return Math.round((correct / block.length) * 100);
  };

  const handleAiSubmit = (block) => {
    const score = evaluateAiBlock(block);
    let nextLevel = currentLevel;

    if (score >= 70) {
      nextLevel = getNextLevel(currentLevel);
    } else if (score < 40) {
      nextLevel = getPrevLevel(currentLevel);
    }

    if (blockStep >= 5 || nextLevel === currentLevel) {
      const flatAiSet = aiBlocks.flat();
      handleFinalSubmit(flatAiSet);
    } else {
      if (aiBlocks[blockStep]) {
        setAiIdx(0);
        setCurrentLevel(nextLevel);
      } else {
        fetchAiBlock(nextLevel);
        setAiIdx(0);
      }
    }
  };

  const handleFinalSubmit = async (aiQset) => {
    const regularAnswers = Object.entries(answers).map(([qid, selected]) => ({
      question_id: qid,
      selected,
    }));

    const aiAnswersFormatted = aiQset.map(q => ({
      question_id: q.question_id,
      selected: aiAnswers[q.question_id],
      correct: q.correct,
      level: q.level,
    }));

    const allAnswers = [...regularAnswers, ...aiAnswersFormatted];

    try {
      const res = await API.post('leveltest/final/', allAnswers);
      setFinalResult(res.data);
    } catch {
      alert('❌ Помилка при надсиланні фінального результату');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${themeClasses.page}`}>
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-6"></div>
        <p className="text-lg font-medium">⏳ Зачекайте, будь ласка. Йде генерація питань...</p>
      </div>
    );
  }

  if (finalResult) {
    const chartData = Object.entries(finalResult.details).map(([level, score]) => ({ level, score }));

    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses.page}`}>
        <div className={`p-8 rounded-2xl shadow-xl w-full max-w-2xl ${themeClasses.card}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">🏁 Завершено!</h2>
          <p className="text-center"><strong>Ваш рівень:</strong> {finalResult.level}</p>
          <p className="text-center"><strong>Загальний бал:</strong> {finalResult.score}%</p>

          <h3 className="mt-6 text-lg font-semibold text-center">📊 Результати за рівнями:</h3>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (currentIdx < questions.length) {
    const q = questions[currentIdx];

    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses.page}`}>
        <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${themeClasses.card}`}>
          <h3 className="text-xl font-semibold mb-2">Питання {currentIdx + 1} / {questions.length}</h3>
          <p className="mb-4">{q.question}</p>
          <div className="space-y-2">
            {['a', 'b', 'c', 'd'].map(opt => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                  className="mr-2"
                />
                {q[`option_${opt}`]}
              </label>
            ))}
          </div>
          <button
            onClick={next}
            disabled={!answers[q.id]}
            className={`mt-6 w-full py-2 rounded-xl font-semibold ${themeClasses.button}`}
          >
            Далі
          </button>
        </div>
      </div>
    );
  }

  const currentBlock = aiBlocks[aiBlocks.length - 1] || [];
  const aiQ = currentBlock[aiIdx];

  if (!aiQ) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${themeClasses.page}`}>
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-6"></div>
        <p className="text-lg font-medium">⏳ Зачекайте, будь ласка. Завантажуються AI-питання...</p>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses.page}`}>
      <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${themeClasses.card}`}>
        <h3 className="text-xl font-semibold mb-2">AI-питання {aiIdx + 1} / {currentBlock.length} (Рівень: {currentLevel})</h3>
        <p className="mb-4">{aiQ.question}</p>
        <div className="space-y-2">
          {Object.entries(aiQ.options).map(([key, text]) => (
            <label key={key} className="block">
              <input
                type="radio"
                name={`ai_${aiIdx}`}
                checked={aiAnswers[aiQ.question_id] === key}
                onChange={() => handleSelect(aiQ.question_id, key, true)}
                className="mr-2"
              />
              {key}: {text}
            </label>
          ))}
        </div>
        <button
          onClick={nextAi}
          disabled={!aiAnswers[aiQ.question_id]}
          className={`mt-6 w-full py-2 rounded-xl font-semibold ${themeClasses.button}`}
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default LevelTest;

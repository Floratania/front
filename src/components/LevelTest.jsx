// import React, { useEffect, useState } from 'react';
// import API from '../services/api'; // переконайся, що токен там в headers

// const LevelTest = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     API.get('leveltest/leveltest/')
//       .then(res => setQuestions(res.data))
//       .catch(err => alert('❌ Не вдалося завантажити тест'));
//   }, []);

//   const handleSelect = (qid, answer) => {
//     setAnswers({ ...answers, [qid]: answer });
//   };

//   const handleSubmit = async () => {
//     const payload = Object.entries(answers).map(([qid, selected]) => ({
//       question_id: qid,
//       selected,
//     }));

//     try {
//       const res = await API.post('leveltest/leveltest/', payload);
//       setResult(res.data);
//       setSubmitted(true);
//     } catch {
//       alert('❌ Помилка при надсиланні результатів');
//     }
//   };

//   if (submitted && result) {
//     return (
//       <div>
//         <h2>✅ Результат тесту</h2>
//         <p><strong>Рівень:</strong> {result.level}</p>
//         <p><strong>Загальний бал:</strong> {result.score}%</p>
//         <h3>📊 Рівні:</h3>
//         <ul>
//           {Object.entries(result.details).map(([level, score]) => (
//             <li key={level}>{level}: {score}%</li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2>🧠 Тест на визначення рівня</h2>
//       {questions.map((q) => (
//         <div key={q.id}>
//           <p><strong>{q.question}</strong></p>
//           {['a', 'b', 'c', 'd'].map((opt) => (
//             <label key={opt}>
//               <input
//                 type="radio"
//                 name={q.id}
//                 value={opt}
//                 checked={answers[q.id] === opt}
//                 onChange={() => handleSelect(q.id, opt)}
//               />
//               {q[`option_${opt}`]}
//             </label>
//           ))}
//         </div>
//       ))}
//       <br />
//       <button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>
//         Завершити тест
//       </button>
//     </div>
//   );
// };

// export default LevelTest;
// import React, { useEffect, useState } from 'react';
// import API from '../services/api';

// const LevelTest = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState(null);
//   const [aiQuestions, setAiQuestions] = useState([]);
//   const [aiAnswers, setAiAnswers] = useState({});
//   const [aiIdx, setAiIdx] = useState(0);
//   const [finalScore, setFinalScore] = useState(null);

//   useEffect(() => {
//     API.get('leveltest/leveltest/')
//       .then(res => setQuestions(res.data))
//       .catch(() => alert('❌ Не вдалося завантажити тест'));
//   }, []);

//   const handleSelect = (qid, selected, fromAi = false) => {
//     if (fromAi) {
//       setAiAnswers({ ...aiAnswers, [qid]: selected });
//     } else {
//       setAnswers({ ...answers, [qid]: selected });
//     }
//   };

//   const next = () => {
//     if (currentIdx + 1 < questions.length) {
//       setCurrentIdx(currentIdx + 1);
//     } else {
//       handleSubmit();
//     }
//   };

//   const nextAi = () => {
//     if (aiIdx + 1 < aiQuestions.length) {
//       setAiIdx(aiIdx + 1);
//     } else {
//       handleAiSubmit();
//     }
//   };

//   const handleSubmit = async () => {
//     const payload = Object.entries(answers).map(([qid, selected]) => ({
//       question_id: qid,
//       selected
//     }));

//     try {
//       const res = await API.post('leveltest/leveltest/', payload);
//       setResult(res.data);
//       setSubmitted(true);

//       if (res.data.score >= 70) {
//         const nextLevel = getNextLevel(res.data.level);
//         const aiRes = await API.get('leveltest/ai_generate/?level=' + nextLevel);

//         let parsed = [];
//         try {
//           parsed = typeof aiRes.data.questions === 'string'
//             ? JSON.parse(aiRes.data.questions)
//             : aiRes.data.questions;
//         } catch {
//           parsed = [];
//         }

//         setAiQuestions(parsed);
//       }
//     } catch {
//       alert('❌ Помилка при надсиланні результатів');
//     }
//   };

//   const handleAiSubmit = () => {
//     // Проста оцінка правильності для AI-блоку
//     let correct = 0;
//     aiQuestions.forEach(q => {
//       if (aiAnswers[q.question] === q.correct) correct++;
//     });
//     const score = Math.round((correct / aiQuestions.length) * 100);
//     setFinalScore(score);
//   };

//   const getNextLevel = (level) => {
//     const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
//     const idx = order.indexOf(level);
//     return idx !== -1 && idx + 1 < order.length ? order[idx + 1] : level;
//   };

//   if (finalScore !== null) {
//     return (
//       <div>
//         <h2>🏁 Завершено!</h2>
//         <p><strong>Результат AI-рівня:</strong> {finalScore}%</p>
//       </div>
//     );
//   }

//   if (aiQuestions.length > 0 && submitted) {
//     const q = aiQuestions[aiIdx];
//     if (!q) return <p>⏳ Завантаження AI-питань...</p>;

//     return (
//       <div>
//         <h3>AI-рівень: Питання {aiIdx + 1} / {aiQuestions.length}</h3>
//         <p><strong>{q.question}</strong></p>
//         {Object.entries(q.options).map(([key, text]) => (
//           <label key={key} style={{ display: 'block', marginBottom: '0.5rem' }}>
//             <input
//               type="radio"
//               name="ai_option"
//               checked={aiAnswers[q.question] === key}
//               onChange={() => handleSelect(q.question, key, true)}
//             />
//             {key}: {text}
//           </label>
//         ))}
//         <br />
//         <button onClick={nextAi} disabled={!aiAnswers[q.question]}>Далі</button>
//       </div>
//     );
//   }

//   if (submitted && result) {
//     return (
//       <div>
//         <h2>✅ Результат тесту</h2>
//         <p><strong>Рівень:</strong> {result.level}</p>
//         <p><strong>Загальний бал:</strong> {result.score}%</p>

//         <h3>📊 Рівні:</h3>
//         <ul>
//           {Object.entries(result.details).map(([level, score]) => (
//             <li key={level}>{level}: {score}%</li>
//           ))}
//         </ul>

//         {result.score < 70 && <p>❗ Щоб перейти на наступний рівень, потрібно не менше 70%.</p>}
//       </div>
//     );
//   }

//   const q = questions[currentIdx];
//   if (!q) return <p>⏳ Завантаження...</p>;

//   return (
//     <div>
//       <h3>Питання {currentIdx + 1} / {questions.length}</h3>
//       <p><strong>{q.question}</strong></p>
//       {['a', 'b', 'c', 'd'].map(opt => (
//         <label key={opt} style={{ display: 'block', marginBottom: '0.5rem' }}>
//           <input
//             type="radio"
//             name="option"
//             checked={answers[q.id] === opt}
//             onChange={() => handleSelect(q.id, opt)}
//           />
//           {q[`option_${opt}`]}
//         </label>
//       ))}
//       <br />
//       <button onClick={next} disabled={!answers[q.id]}>Далі</button>
//     </div>
//   );
// };

// export default LevelTest;
import React, { useEffect, useState } from 'react';
import API from '../services/api';

const LevelTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiAnswers, setAiAnswers] = useState({});
  const [aiIdx, setAiIdx] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

  const getNextLevel = (level) => {
    const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const idx = order.indexOf(level);
    return idx !== -1 && idx + 1 < order.length ? order[idx + 1] : level;
  };

  const getCombinedLevels = (level) => {
    const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const idx = order.indexOf(level);
    const prev = idx > 0 ? order[idx - 1] : level;
    const next = idx < order.length - 1 ? order[idx + 1] : level;
    return [prev, level, next];
  };

  useEffect(() => {
    API.get('leveltest/leveltest/')
      .then(res => setQuestions(res.data))
      .catch(() => alert('❌ Не вдалося завантажити тест'));
  }, []);

  const handleSelect = (qid, selected, fromAi = false) => {
    if (fromAi) {
      setAiAnswers({ ...aiAnswers, [qid]: selected });
    } else {
      setAnswers({ ...answers, [qid]: selected });
    }
  };

  const next = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const nextAi = () => {
    if (aiIdx + 1 < aiQuestions.length) {
      setAiIdx(aiIdx + 1);
    } else {
      handleAiSubmit();
    }
  };

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([qid, selected]) => ({
      question_id: qid,
      selected
    }));

    try {
      const res = await API.post('leveltest/leveltest/', payload);
      setResult(res.data);
      setSubmitted(true);

      // Генерація AI-питань, якщо ≥ 70% на своєму рівні
      if (res.data.details[res.data.level] >= 70) {
        const combined = getCombinedLevels(res.data.level);
        const responses = await Promise.all(
          combined.map(lvl => API.get('leveltest/ai_generate/?level=' + lvl))
        );

        let allQs = [];
        for (const res of responses) {
          let q = [];
          try {
            q = typeof res.data.questions === 'string'
              ? JSON.parse(res.data.questions)
              : res.data.questions;
          } catch { q = []; }
          allQs = [...allQs, ...q];
        }

        setAiQuestions(allQs);
      }
    } catch {
      alert('❌ Помилка при надсиланні результатів');
    }
  };

  const handleAiSubmit = () => {
    const levelStats = {}; // { B1: { correct: 0, total: 0 }, ... }
  
    aiQuestions.forEach(q => {
      const lvl = q.source_level || 'B1'; // fallback
  
      if (!levelStats[lvl]) levelStats[lvl] = { correct: 0, total: 0 };
      levelStats[lvl].total += 1;
  
      if (aiAnswers[q.question] === q.correct) {
        levelStats[lvl].correct += 1;
      }
    });
  
    const levelPercentages = {};
    Object.entries(levelStats).forEach(([level, stats]) => {
      levelPercentages[level] = Math.round((stats.correct / stats.total) * 100);
    });
  
    // Визначення найвищого рівня з ≥ 60% і всі попередні також ≥ 60%
    const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let finalLevel = 'A1';
  
    for (let i = 0; i < order.length; i++) {
      const lvl = order[i];
      if (levelPercentages[lvl] >= 60) {
        const allPrevOk = order.slice(0, i).every(prev => levelPercentages[prev] >= 60);
        if (allPrevOk) finalLevel = lvl;
      }
    }
  
    setFinalScore({ score: levelPercentages, level: finalLevel });
  };
  

  if (finalScore !== null) {
    return (
      <div>
        <h2>🏁 AI-тест завершено</h2>
        <p><strong>Рівень за AI:</strong> {finalScore.level}</p>
        <h3>📊 Деталі по рівнях:</h3>
        <ul>
          {Object.entries(finalScore.score).map(([lvl, val]) => (
            <li key={lvl}>{lvl}: {val}%</li>
          ))}
        </ul>
      </div>
    );
  }
  

  if (aiQuestions.length > 0 && submitted) {
    const q = aiQuestions[aiIdx];
    if (!q) return <p>⏳ Завантаження AI-питань...</p>;

    return (
      <div>
        <h3>AI-рівень: Питання {aiIdx + 1} / {aiQuestions.length}</h3>
        <p><strong>{q.question}</strong></p>
        {Object.entries(q.options).map(([key, text]) => (
          <label key={key} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="radio"
              name={`ai_${aiIdx}`}
              checked={aiAnswers[q.question] === key}
              onChange={() => handleSelect(q.question, key, true)}
            />
            {key}: {text}
          </label>
        ))}
        <br />
        <button onClick={nextAi} disabled={!aiAnswers[q.question]}>Далі</button>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div>
        <h2>✅ Результат тесту</h2>
        <p><strong>Рівень:</strong> {result.level}</p>
        <p><strong>Загальний бал:</strong> {result.score}%</p>

        <h3>📊 Рівні:</h3>
        <ul>
          {Object.entries(result.details).map(([level, score]) => (
            <li key={level}>{level}: {score}%</li>
          ))}
        </ul>

        {result.score < 70 && <p>❗ Щоб перейти на наступний рівень, потрібно не менше 70%.</p>}
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return <p>⏳ Завантаження...</p>;

  return (
    <div>
      <h3>Питання {currentIdx + 1} / {questions.length}</h3>
      <p><strong>{q.question}</strong></p>
      {['a', 'b', 'c', 'd'].map(opt => (
        <label key={opt} style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="radio"
            name="option"
            checked={answers[q.id] === opt}
            onChange={() => handleSelect(q.id, opt)}
          />
          {q[`option_${opt}`]}
        </label>
      ))}
      <br />
      <button onClick={next} disabled={!answers[q.id]}>Далі</button>
    </div>
  );
};

export default LevelTest;
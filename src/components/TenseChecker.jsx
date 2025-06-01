// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TENSE_OPTIONS = [
//   "Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous",
//   "Past Simple", "Past Continuous", "Past Perfect", "Past Perfect Continuous",
//   "Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous"
// ];

// const TenseQuiz = () => {
//   const [question, setQuestion] = useState(null);
//   const [selected, setSelected] = useState('');
//   const [feedback, setFeedback] = useState('');

//   const fetchQuiz = async () => {
//     const res = await axios.get('http://localhost:8000/api/quiz/');
//     setQuestion(res.data);
//     setSelected('');
//     setFeedback('');
//   };

//   const checkAnswer = () => {
//     if (selected === question.correct) {
//       setFeedback('✅ Правильно!');
//     } else {
//       setFeedback(`❌ Неправильно. Правильна відповідь: ${question.correct}`);
//     }
//   };

//   useEffect(() => {
//     fetchQuiz();
//   }, []);

//   return (
//     <div>
//       <h2>🎓 Визнач час речення</h2>
//       {question && <p><strong>{question.sentence}</strong></p>}

//       <select value={selected} onChange={(e) => setSelected(e.target.value)}>
//         <option value="">— Виберіть час —</option>
//         {TENSE_OPTIONS.map(opt => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>

//       <button onClick={checkAnswer} disabled={!selected}>Перевірити</button>
//       {feedback && <p>{feedback}</p>}

//       <button onClick={fetchQuiz} style={{ marginTop: '1rem' }}>🔁 Наступне</button>
//     </div>
//   );
// };

// export default TenseQuiz;

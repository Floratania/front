// // src/components/TensePage.jsx
// import { useParams } from 'react-router-dom';

// import PresentSimple from './tenses/PresentSimple';
// import PresentContinuous from './tenses/PresentContinuous';
// import PresentPerfect from './tenses/PresentPerfect';
// import PresentPerfectContinuous from './tenses/PresentPerfectContinuous';
// import PastSimple from './tenses/PastSimple';
// import PastContinuous from './tenses/PastContinuous';
// import PastPerfect from './tenses/PastPerfect';
// import PastPerfectContinuous from './tenses/PastPerfectContinuous';
// import FutureSimple from './tenses/FutureSimple';
// import FutureContinuous from './tenses/FutureContinuous';
// import FuturePerfect from './tenses/FuturePerfect';
// import FuturePerfectContinuous from './tenses/FuturePerfectContinuous';

// export default function TensePage() {
//   const { tenseName } = useParams();
//   const decoded = decodeURIComponent(tenseName);

//   const TENSE_MAP = {
//     'Present Simple': <PresentSimple />,
//     'Present Continuous': <PresentContinuous />,
//     'Present Perfect': <PresentPerfect />,
//     'Present Perfect Continuous': <PresentPerfectContinuous />,
//     'Past Simple': <PastSimple />,
//     'Past Continuous': <PastContinuous />,
//     'Past Perfect': <PastPerfect />,
//     'Past Perfect Continuous': <PastPerfectContinuous />,
//     'Future Simple': <FutureSimple />,
//     'Future Continuous': <FutureContinuous />,
//     'Future Perfect': <FuturePerfect />,
//     'Future Perfect Continuous': <FuturePerfectContinuous />,
//   };

//   return TENSE_MAP[decoded] || <p>⛔ Час "{decoded}" не знайдено</p>;
// }
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

import PresentSimple from './tenses/PresentSimple';
import PresentContinuous from './tenses/PresentContinuous';
import PresentPerfect from './tenses/PresentPerfect';
import PresentPerfectContinuous from './tenses/PresentPerfectContinuous';
import PastSimple from './tenses/PastSimple';
import PastContinuous from './tenses/PastContinuous';
import PastPerfect from './tenses/PastPerfect';
import PastPerfectContinuous from './tenses/PastPerfectContinuous';
import FutureSimple from './tenses/FutureSimple';
import FutureContinuous from './tenses/FutureContinuous';
import FuturePerfect from './tenses/FuturePerfect';
import FuturePerfectContinuous from './tenses/FuturePerfectContinuous';

export default function TensePage() {
  const { tenseName } = useParams();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const decoded = decodeURIComponent(tenseName);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        text: 'text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        text: 'text-gray-900',
      };

  const TENSE_MAP = {
    'Present Simple': <PresentSimple />,
    'Present Continuous': <PresentContinuous />,
    'Present Perfect': <PresentPerfect />,
    'Present Perfect Continuous': <PresentPerfectContinuous />,
    'Past Simple': <PastSimple />,
    'Past Continuous': <PastContinuous />,
    'Past Perfect': <PastPerfect />,
    'Past Perfect Continuous': <PastPerfectContinuous />,
    'Future Simple': <FutureSimple />,
    'Future Continuous': <FutureContinuous />,
    'Future Perfect': <FuturePerfect />,
    'Future Perfect Continuous': <FuturePerfectContinuous />,
  };

  return (
    <div className={`min-h-screen ${themeClasses.page} px-6 py-10`}>
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button> */}

      <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl ${themeClasses.card}`}>
        {TENSE_MAP[decoded] || (
          <p className={`text-xl font-semibold ${themeClasses.text}`}>
            ⛔ Час <strong>"{decoded}"</strong> не знайдено
          </p>
        )}
      </div>
    </div>
  );
}

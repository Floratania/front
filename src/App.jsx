import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from './components/Dashboard';
import FlashcardTrainer from "./components/FlashcardTrainer";
import OxfordImporter from './components/OxfordImporter';
import WordSetSelector from './components/WordSetSelector';
import LevelTest from './components/LevelTest';
import WordDragAndDrop from "./components/WordAndDrag";
import Translate from './components/Translate';
import TenseSelector from './components/TenseSelector';
import TensePage from './components/TensePage';
import PrivateRoute from './utils/PrivateRoute';
import ProfilePage from './components/ProfilePage';
import PartOfSpeech from './components/PartOfSpeech';

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const { token, logoutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const themeClasses = theme === 'dark'
    ? {
        navbar: 'bg-gradient-to-r  from-[#3D102F] to-[#11123D] text-white',
        link: 'text-white hover:text-purple-300',
        button: 'bg-[#3D102F] text-white hover:bg-[#5b1c48]',
        toggle: 'bg-white text-gray-800',
        drawer: 'bg-[#1c1c2b]',
      }
    : {
        navbar: 'bg-gradient-to-r from-blue-100 via-purple-100 to-white text-gray-900',
        link: 'text-gray-900 hover:text-blue-600',
        button: 'bg-blue-500 text-white hover:bg-purple-600',
        toggle: 'bg-white text-gray-800',
        drawer: 'bg-white',
      };

  const handleLogout = () => {
    logoutUser();       // очистити токен
    setMenuOpen(false); // закрити меню
    navigate('/login'); // перекинути користувача
  };

  return (
    <>
      {token && (
        <div className="flex h-screen">
          {/* Sidebar */}
          {menuOpen && (
            <div className={`w-64 shrink-0 shadow-md z-10 ${themeClasses.drawer} p-6`}>
              <div className="flex flex-col gap-4 text-base">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="self-end text-2xl font-bold mb-4"
                  aria-label="Закрити меню"
                >
                  ✖
                </button>
                <Link to="/flashcards" onClick={() => setMenuOpen(false)} className={themeClasses.link}>📇 Флеш-картки</Link>
                <Link to="/wordsets" onClick={() => setMenuOpen(false)} className={themeClasses.link}>📚 Обрати набір</Link>
                <Link to="/import" onClick={() => setMenuOpen(false)} className={themeClasses.link}>⬆️ Імпорт</Link>
                <Link to="/level-test" onClick={() => setMenuOpen(false)} className={themeClasses.link}>🧠 Тест рівня</Link>
                <Link to="/wd" onClick={() => setMenuOpen(false)} className={themeClasses.link}>🧩 Речення</Link>
                <Link to="/translate" onClick={() => setMenuOpen(false)} className={themeClasses.link}>🌐 Перекладач</Link>
                <Link to="/tenses" onClick={() => setMenuOpen(false)} className={themeClasses.link}>⏱️ Часи</Link>
                <Link to="/partofspeech" onClick={() => setMenuOpen(false)} className={themeClasses.link}>⏱ Частина мови</Link>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-col flex-grow">
            {/* Navbar */}
            <header className={`shadow-md ${themeClasses.navbar} px-4 py-3 flex justify-between items-center`}>
              <div className="flex items-center gap-4">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl focus:outline-none">
                  ☰
                </button>
                <Link to="/profile" className="font-bold text-lg">👤 Профіль</Link>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`px-3 py-1 rounded-full text-sm shadow ${themeClasses.toggle}`}
                >
                  {theme === 'dark' ? '☀️ Світла' : '🌙 Темна'}
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${themeClasses.button}`}
                >
                  🚪 Вийти
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-grow overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/flashcards" element={<PrivateRoute><FlashcardTrainer /></PrivateRoute>} />
                <Route path="/import" element={<PrivateRoute><OxfordImporter /></PrivateRoute>} />
                <Route path="/wordsets" element={<PrivateRoute><WordSetSelector onSubscribed={() => {}} /></PrivateRoute>} />
                <Route path="/wd" element={<PrivateRoute><WordDragAndDrop /></PrivateRoute>} />
                <Route path="/level-test" element={<PrivateRoute><LevelTest /></PrivateRoute>} />
                <Route path="/translate" element={<PrivateRoute><Translate /></PrivateRoute>} />
                <Route path="/tenses" element={<PrivateRoute><TenseSelector /></PrivateRoute>} />
                <Route path="/tense/:tenseName" element={<PrivateRoute><TensePage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/partofspeech" element={<PrivateRoute><PartOfSpeech /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      )}

      {!token && (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      )}
    </>
  );
}

export default AppWrapper;

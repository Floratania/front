import React, { useState, useContext } from 'react';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { loginUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.username, form.password);
      loginUser(data.access);
      navigate('/dashboard');
    } catch (err) {
      setError('❌ Невірне ім’я користувача або пароль');
    }
  };

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        text: 'text-white',
        subtext: 'text-gray-400',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white',
        link: 'text-purple-400',
        overlay: 'bg-[#11123D]/70',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        link: 'text-blue-600',
        overlay: 'bg-white/70',
      };

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.page} px-4 py-8 transition-all duration-500 ease-in-out`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button>

      <div className={`shadow-2xl rounded-3xl w-full max-w-md md:max-w-xl lg:max-w-4xl flex flex-col md:flex-row overflow-hidden ${themeClasses.card}`}>
        {/* Left Side Image + Overlay */}
        <div className="relative hidden md:block w-1/2">
          <img
            src="https://i.lb.ua/085/52/67cabaf076fd3.jpeg"
            alt="Навчання"
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 ${themeClasses.overlay} flex flex-col justify-center px-8 ${themeClasses.text}`}>
            <h2 className="text-3xl font-bold leading-snug">Відкрий свій потенціал в англійській</h2>
            <p className="mt-4 text-sm">
              Приєднуйся до нашої інтерактивної платформи та навчайся у власному темпі.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          <h2 className={`text-3xl font-extrabold text-center md:text-left ${themeClasses.text}`}>
            Ласкаво просимо 👋
          </h2>
          <p className={`mt-2 text-center md:text-left ${themeClasses.subtext}`}>
            Увійди, щоб продовжити навчання.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-5 md:space-y-6">
            <input
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
              placeholder="Ім’я користувача"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              type="password"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className={`w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}
            >
              Увійти →
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className={`mt-6 text-sm text-center ${themeClasses.subtext}`}>
            Ще не маєш акаунту?{' '}
            <a
              href="/register"
              className={`${themeClasses.link} font-medium hover:underline`}
            >
              Зареєструватися
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

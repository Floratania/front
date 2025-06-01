import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    birth_date: '',
  });

  const [message, setMessage] = useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setMessage(response.ok ? '✅ Реєстрація успішна!' : data.error || '❌ Помилка при реєстрації');
    } catch {
      setMessage('❌ Сервер не відповідає');
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
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.page} px-4 py-10 transition-all duration-500 ease-in-out`}>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button>

      <div className={`shadow-2xl rounded-3xl w-full max-w-md md:max-w-xl lg:max-w-4xl flex flex-col md:flex-row overflow-hidden ${themeClasses.card}`}>
        
        {/* Left image + overlay with text */}
        <div className="relative hidden md:block w-1/2">
          <img
            src="https://i.lb.ua/085/52/67cabaf076fd3.jpeg"
            alt="Навчання"
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 ${themeClasses.overlay} flex flex-col justify-center px-8 ${themeClasses.text}`}>
            <h2 className="text-3xl font-bold leading-snug">Розпочни свою англійську подорож сьогодні</h2>
            <p className="mt-4 text-sm">
              Зареєструйся зараз, щоб отримати доступ до персоналізованої платформи навчання.
            </p>
          </div>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-8 md:p-10 lg:p-14 space-y-5">
          <h2 className={`text-3xl font-extrabold text-center md:text-left ${themeClasses.text}`}>Реєстрація</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="first_name" placeholder="Ім’я" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
            <input name="last_name" placeholder="Прізвище" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
            <input name="username" placeholder="Ім’я користувача" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
            <input name="email" type="email" placeholder="Електронна пошта" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
            <input name="phone" type="tel" placeholder="Телефон" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
            <input name="birth_date" type="date" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />
          </div>

          <select name="gender" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`}>
            <option value="">Стать</option>
            <option value="male">Чоловік</option>
            <option value="female">Жінка</option>
            <option value="other">Інше</option>
          </select>

          <input name="password" type="password" placeholder="Пароль" onChange={handleChange} className={`w-full py-2.5 px-4 text-base rounded-xl border ${themeClasses.input}`} />

          <button type="submit" className={`w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}>
            Зареєструватися →
          </button>

          {message && <p className="text-center text-sm mt-2 text-red-400 dark:text-red-300">{message}</p>}

          <p className={`mt-6 text-sm text-center ${themeClasses.subtext}`}>
            Уже маєш акаунт?{' '}
            <Link to="/login" className={`${themeClasses.link} font-medium hover:underline`}>
              Увійти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

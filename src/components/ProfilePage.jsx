import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const ProfilePage = () => {
  const { token } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    english_level: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await axios.get('http://localhost:8000/api/my_profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("❌ Помилка завантаження профілю:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) return;
      await axios.put('http://localhost:8000/api/my_profile/', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Зміни збережено успішно");
    } catch {
      setMessage("❌ Помилка при збереженні");
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
        overlay: 'bg-[#11123D]/70',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        overlay: 'bg-white/70',
      };

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.page} px-4 py-8 transition-all duration-500 ease-in-out`}>
  
      <div className={`shadow-2xl rounded-3xl w-full max-w-md md:max-w-xl lg:max-w-4xl flex flex-col md:flex-row overflow-hidden ${themeClasses.card}`}>
        <div className="relative hidden md:block w-1/2">
          <img
            src="https://i.ibb.co/5P2MrK8/Flux-Dev-Create-a-stunning-and-creative-background-image-for-a-0.jpg"
            alt="Профіль"
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 ${themeClasses.overlay} flex flex-col justify-center px-8 ${themeClasses.text}`}>
            <h2 className="text-3xl font-bold leading-snug">Редагуй свій профіль</h2>
            <p className="mt-4 text-sm">
              Залишайся на зв’язку та оновлюй персональні дані зручно.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          <h2 className={`text-2xl font-extrabold text-center md:text-left ${themeClasses.text}`}>
            👤 Мій профіль
          </h2>

          {message && <p className="mt-2 text-center font-medium text-green-500">{message}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input name="username" value={profile.username} disabled className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <input name="first_name" placeholder="Ім’я" value={profile.first_name} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <input name="last_name" placeholder="Прізвище" value={profile.last_name} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <input name="email" type="email" placeholder="Email" value={profile.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <input name="phone" placeholder="Телефон" value={profile.phone} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <input name="birth_date" type="date" value={profile.birth_date || ''} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <select name="gender" value={profile.gender} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`}>
              <option value="">Стать</option>
              <option value="male">Чоловік</option>
              <option value="female">Жінка</option>
              <option value="other">Інше</option>
            </select>

            <input name="english_level" placeholder="Рівень англійської" value={profile.english_level} onChange={handleChange} className={`w-full px-4 py-2 rounded-xl border ${themeClasses.input}`} />

            <button type="submit" className={`w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}>
              💾 Зберегти зміни
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

function ChangePassword({ token }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        text: 'text-white',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
      };

  const handleChange = async () => {
    try {
      const res = await axios.post(
        '/api/change-password/',
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(res.data.message || 'Пароль успішно змінено');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Помилка при зміні пароля');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${themeClasses.page}`}>
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-xl ${themeClasses.card}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>🔒 Зміна пароля</h2>
        <input
          type="password"
          className={`w-full mb-4 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
          placeholder="Старий пароль"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          className={`w-full mb-6 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
          placeholder="Новий пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleChange}
          className={`w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}
        >
          Змінити пароль
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;

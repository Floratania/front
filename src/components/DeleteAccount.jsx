import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

function DeleteAccount({ token }) {
  const [message, setMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        text: 'text-white',
        button: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        text: 'text-gray-900',
        button: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
      };

  const handleDelete = async () => {
    if (!window.confirm("Ти впевнений(-а), що хочеш видалити акаунт?")) return;

    try {
      const res = await axios.delete('/api/delete-user/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.detail || 'Акаунт видалено');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    } catch (err) {
      setMessage('Помилка при видаленні акаунта');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${themeClasses.page}`}>
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-xl ${themeClasses.card}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>🗑️ Видалення акаунта</h2>
        <p className={`text-center mb-6 ${themeClasses.text}`}>
          Ця дія є незворотною. Твій акаунт буде остаточно видалено.
        </p>
        <button
          onClick={handleDelete}
          className={`w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}
        >
          Видалити акаунт
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default DeleteAccount;

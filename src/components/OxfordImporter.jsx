import React, { useState, useContext } from 'react';
import API from '../services/flashcards';
import { ThemeContext } from '../context/ThemeContext';

const OxfordImporter = () => {
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState('');
  const [customFile, setCustomFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleImport = async (listType) => {
    setLoading(true);
    setImported('');
    try {
      const res = await API.post('flashcards/wordsets/import_from_file/', {
        list_type: listType,
      });
      setImported(`✅ ${listType.toUpperCase()} імпортовано: ${res.data.imported} слів`);
    } catch (err) {
      setImported('❌ Помилка імпорту');
    }
    setLoading(false);
  };

  const handleCustomUpload = async () => {
    if (!customFile) return;
    if (!customFile.name.endsWith('.txt')) {
      setImported('❌ Потрібен .txt файл');
      return;
    }

    setLoading(true);
    setImported('');

    const formData = new FormData();
    formData.append('file', customFile);
    formData.append('is_public', isPublic.toString());

    try {
      const res = await API.post('flashcards/wordsets/import_custom/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImported(`✅ Імпортовано ${res.data.imported} слів з вашого файлу`);
    } catch (err) {
      if (err.response?.data?.error) {
        setImported(`❌ ${err.response.data.error}`);
      } else {
        setImported('❌ Помилка імпорту власного файлу');
      }
    }

    setLoading(false);
  };

  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#1c1c2b]',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        text: 'text-white',
        subtext: 'text-gray-400',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
      };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${themeClasses.page} transition-all duration-500 ease-in-out`}>
      {/* Theme Toggle */}
      {/* <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow hover:shadow-md transition z-10"
      >
        {theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button> */}

      <div className={`shadow-2xl rounded-3xl w-full max-w-2xl p-10 ${themeClasses.card}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${themeClasses.text}`}>
          📘 Імпорт словників
        </h2>

        <div className="space-y-6">
          {/* Власний файл */}
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>
              📂 Завантажити власний .txt файл
            </h3>
            <input
              type="file"
              accept=".txt"
              onChange={(e) => setCustomFile(e.target.files[0])}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
            />
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
              />
              <label className={themeClasses.subtext}>Зробити словник публічним</label>
            </div>
            <button
              onClick={handleCustomUpload}
              disabled={loading || !customFile}
              className={`mt-4 w-full py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}
            >
              📥 Імпортувати файл
            </button>
            <p className={`text-sm mt-2 ${themeClasses.subtext}`}>
              Кожне слово має бути в окремому рядку.
            </p>
          </div>

          {/* Кнопки для Oxford, Top3000 і т.п. */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['oxford3000', 'oxford5000'].map((list) => (
              <button
                key={list}
                onClick={() => handleImport(list)}
                disabled={loading}
                className={`py-3 font-semibold rounded-xl hover:shadow-xl transition duration-300 ${themeClasses.button}`}
              >
                📤 Імпортувати {list.toUpperCase()}
              </button>
            ))}
          </div> */}

          {imported && (
            <p className="text-center text-sm font-medium mt-4 text-green-500">
              {imported}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OxfordImporter;

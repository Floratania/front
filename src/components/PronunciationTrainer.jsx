import React, { useEffect, useState, useContext } from 'react';
import { BarChart, LineChart } from '@mui/x-charts';
import { Button, TextField, Paper, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import HearingIcon from '@mui/icons-material/Hearing';
import stringSimilarity from 'string-similarity';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const PronunciationTrainer = () => {
  const [word, setWord] = useState('example');
  const [spokenText, setSpokenText] = useState('');
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [recording, setRecording] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // 1) Додаємо themeClasses.paper для коректної стилізації Paper під теми
  const themeClasses = theme === 'dark'
    ? {
        page: 'bg-gradient-to-br from-[#11123D] via-[#3D102F] to-[#461D11] text-white',
        card: 'bg-[#11123D] text-white',
        paper: 'bg-[#1a1a2e] text-white',
        input: 'bg-[#2b2b3c] text-white border-[#444]',
        text: 'text-white',
        button: 'bg-gradient-to-r from-[#3D102F] to-[#461D11] text-white',
      }
    : {
        page: 'bg-gradient-to-br from-white via-purple-100 to-blue-100 text-gray-900',
        card: 'bg-white text-gray-900',
        paper: 'bg-white text-gray-900',
        input: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-900',
        button: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
      };

      const speak = () => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
      
        if (!voices.length) {
          synth.onvoiceschanged = () => speak();
          return;
        }
      
        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = 'en-US';
        utter.voice = voices.find(v => v.lang === 'en-US') || voices[0];
        utter.volume = 1;
        utter.rate = 1;
        utter.pitch = 1;
      
        synth.cancel(); // На випадок попередніх завислих utterances
        synth.speak(utter);
      };
      
      

  const recognizeSpeech = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript;
      setSpokenText(result);

      const similarity = stringSimilarity.compareTwoStrings(word.toLowerCase(), result.toLowerCase());
      const score = Math.round(similarity * 100);
      const is_correct = similarity >= 0.85;

      try {
        await API.post('pronunciation/', { word, spoken_text: result, score, is_correct });
        setScore(score);
        fetchHistory();
      } catch (e) {
        console.error('❌ Error submitting pronunciation attempt:', e);
      }
    };

    recognition.start();
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get('pronunciation/history/');
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('⚠️ History fetch failed:', err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    console.log('🔈 Available voices:', voices);
  
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('📥 Voices loaded:', window.speechSynthesis.getVoices());
      };
    }
  }, []);
  

  const getScoreDistribution = () => {
    const scores = [0, 0, 0, 0];
    history.forEach(({ score }) => {
      if (score <= 25) scores[0]++;
      else if (score <= 50) scores[1]++;
      else if (score <= 75) scores[2]++;
      else scores[3]++;
    });
    return scores;
  };

  const getWordFrequency = () => {
    const freq = {};
    history.forEach(({ word }) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return Object.entries(freq).map(([word, count]) => ({ word, count }));
  };

  const getSuccessRateOverTime = () => {
    const map = {};
    history.forEach(({ timestamp, is_correct }) => {
      const date = timestamp.split('T')[0];
      if (!map[date]) map[date] = [];
      map[date].push(is_correct ? 1 : 0);
    });
    return Object.entries(map).map(([date, vals]) => ({
      date,
      rate: (vals.reduce((a, b) => a + b, 0) / vals.length) * 100,
    }));
  };

  return (
    // 2) Використовуємо лише themeClasses.page, без жодних додаткових bg-*
    <div className={`min-h-screen px-4 py-8 transition-all duration-500 ease-in-out ${themeClasses.page}`}>
      {/* 3) Paper тепер отримує фон лише з themeClasses.paper */}
      <Paper
        elevation={4}
        className={`max-w-4xl mx-auto p-6 md:p-10 rounded-3xl shadow-xl ${themeClasses.paper}`}
      >
        {/* Якщо у вас є кнопка-перемикач теми, можете додати її тут: */}
        {/* <Button onClick={toggleTheme} className="mb-4">
            {theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          </Button> */}

        <Typography variant="h4" gutterBottom >
          🎙️ Тренажер вимови
        </Typography>

        <TextField
          label="Слово для тренування"
          variant="outlined"
          fullWidth
          value={word}
          onChange={(e) => setWord(e.target.value)}
        //   // 4) Інлайн-стилі для коректної видимості тексту в полях
        //   InputProps={{
        //     style: { color: theme === 'dark' ? '#fff' : '#000' },
        //   }}
        //   InputLabelProps={{
        //     style: { color: theme === 'dark' ? '#ccc' : '#000' },











        

        //   }}
        />

        <br />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            startIcon={<HearingIcon />}
            variant="contained"
            onClick={speak}
            className={themeClasses.button}
          >
            Прослухати
          </Button>
          <Button
            startIcon={<MicIcon />}
            variant="contained"
            color="secondary"
            onClick={recognizeSpeech}
          >
            {recording ? '🎙️ Запис...' : 'Говорити'}
          </Button>
        </Box>

        {spokenText && (
          <Box mb={3}>
            <Typography >
              Ви сказали: <strong>{spokenText}</strong>
            </Typography>
            {score !== null && (
              <Typography style={{ color: score >= 85 ? 'limegreen' : 'tomato' }}>
                Схожість: <strong>{score}%</strong>
              </Typography>
            )}
          </Box>
        )}

        <Box mb={4}>
          <Typography variant="h6">
            📊 Розподіл балів
          </Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['0-25%', '26-50%', '51-75%', '76-100%'] }]}
            series={[{ data: getScoreDistribution(), type: 'bar' }]}
            height={250}
          />
        </Box>

        <Box mb={4}>
          <Typography variant="h6" >
            📈 Частота слів
          </Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: getWordFrequency().map((d) => d.word) }]}
            series={[{ data: getWordFrequency().map((d) => d.count), type: 'bar' }]}
            height={250}
          />
        </Box>

        {/* <Box mb={4}>
          <Typography variant="h6">
            📅 Рівень успіху за часом
          </Typography>
          <LineChart
            xAxis={[{ scaleType: 'point', data: getSuccessRateOverTime().map((d) => d.date) }]}
            series={[{ data: getSuccessRateOverTime().map((d) => d.rate), type: 'line' }]}
            height={250}
          />
        </Box> */}
      </Paper>
    </div>
  );
};

export default PronunciationTrainer;

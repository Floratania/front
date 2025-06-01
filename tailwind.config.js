module.exports = {
    darkMode: 'class', // ✅ обов’язково
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    // theme: {
    //   extend: {}
    // },
    plugins: [],
    theme: {
        extend: {
          colors: {
            'royal-blue': '#3461E0',
            'punch': '#DD3F31',
            'zest': '#E17D32',
          },
          fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
          }
        },
      }
      
  };
  
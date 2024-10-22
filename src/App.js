import React, { useState, useEffect } from 'react';
import TimeZoneConverter from './TimeZoneConverter';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  return (
    <div className="App">
      <TimeZoneConverter theme={theme} onThemeToggle={toggleTheme} />
    </div>
  );
}

export default App;
